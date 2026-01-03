import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Plus, TrendingUp, Calculator } from "lucide-react";
import { toast } from "sonner";

interface Deal {
  id: number;
  name: string;
  currentValuation: string | null;
  revenue: string | null;
  ebitda: string | null;
  debt: string | null;
}

interface ScenarioModelerProps {
  dealId: number;
  deal: Deal;
}

interface ScenarioInputs {
  name: string;
  entryValuation: number;
  stakePercentage: number;
  investmentAmount: number;
  debtPercentage: number;
  revenueGrowthRate: number;
  ebitdaMarginImprovement: number;
  exitYear: number;
  exitMultiple: number;
}

interface ScenarioResults {
  exitValuation: number;
  exitEquityValue: number;
  totalReturn: number;
  irr: number;
  moic: number;
  cashOnCash: number;
}

export default function ScenarioModeler({ dealId, deal }: ScenarioModelerProps) {
  const utils = trpc.useUtils();
  const { data: scenarios, isLoading } = trpc.scenarios.byDeal.useQuery({ dealId });

  const [inputs, setInputs] = useState<ScenarioInputs>({
    name: "Base Case",
    entryValuation: deal.currentValuation ? parseFloat(deal.currentValuation) : 500,
    stakePercentage: 15,
    investmentAmount: 0,
    debtPercentage: 0,
    revenueGrowthRate: 5,
    ebitdaMarginImprovement: 0,
    exitYear: 5,
    exitMultiple: 0,
  });

  const [results, setResults] = useState<ScenarioResults | null>(null);

  // Calculate investment amount based on valuation and stake
  useEffect(() => {
    const amount = (inputs.entryValuation * inputs.stakePercentage) / 100;
    setInputs(prev => ({ ...prev, investmentAmount: amount }));
  }, [inputs.entryValuation, inputs.stakePercentage]);

  // Calculate exit multiple based on entry valuation and EBITDA
  useEffect(() => {
    if (deal.ebitda) {
      const entryMultiple = inputs.entryValuation / parseFloat(deal.ebitda);
      setInputs(prev => ({ ...prev, exitMultiple: entryMultiple }));
    }
  }, [inputs.entryValuation, deal.ebitda]);

  // Real-time scenario calculations
  useEffect(() => {
    calculateScenario();
  }, [inputs]);

  const calculateScenario = () => {
    // Base financials
    const currentRevenue = deal.revenue ? parseFloat(deal.revenue) : 0;
    const currentEBITDA = deal.ebitda ? parseFloat(deal.ebitda) : 0;
    const currentMargin = currentRevenue > 0 ? (currentEBITDA / currentRevenue) * 100 : 0;

    // Project future financials
    const futureRevenue = currentRevenue * Math.pow(1 + inputs.revenueGrowthRate / 100, inputs.exitYear);
    const futureMargin = currentMargin + inputs.ebitdaMarginImprovement;
    const futureEBITDA = (futureRevenue * futureMargin) / 100;

    // Exit valuation
    const exitValuation = futureEBITDA * inputs.exitMultiple;
    const exitEquityValue = exitValuation; // Simplified: not accounting for debt paydown

    // Returns calculation
    const equityInvested = inputs.investmentAmount * (1 - inputs.debtPercentage / 100);
    const exitProceeds = (exitEquityValue * inputs.stakePercentage) / 100;
    const totalReturn = exitProceeds - equityInvested;
    
    // MOIC
    const moic = equityInvested > 0 ? exitProceeds / equityInvested : 0;

    // IRR calculation (simplified)
    const irr = equityInvested > 0 && inputs.exitYear > 0
      ? (Math.pow(moic, 1 / inputs.exitYear) - 1) * 100
      : 0;

    // Cash-on-cash
    const cashOnCash = inputs.investmentAmount > 0 ? (totalReturn / inputs.investmentAmount) * 100 : 0;

    setResults({
      exitValuation,
      exitEquityValue,
      totalReturn,
      irr,
      moic,
      cashOnCash,
    });
  };

  const createScenario = trpc.scenarios.create.useMutation({
    onSuccess: () => {
      toast.success("Scenario saved");
      utils.scenarios.byDeal.invalidate({ dealId });
    },
    onError: (error) => {
      toast.error(`Failed to save scenario: ${error.message}`);
    },
  });

  const handleSaveScenario = () => {
    if (!results) return;

    createScenario.mutate({
      dealId,
      name: inputs.name,
      entryValuation: inputs.entryValuation.toString(),
      entryMultiple: inputs.exitMultiple.toFixed(1),
      stakePercentage: inputs.stakePercentage.toString(),
      investmentAmount: inputs.investmentAmount.toFixed(1),
      debtPercentage: inputs.debtPercentage.toString(),
      revenueGrowthRate: inputs.revenueGrowthRate.toString(),
      ebitdaMarginImprovement: inputs.ebitdaMarginImprovement.toString(),
      exitYear: inputs.exitYear,
      exitMultiple: inputs.exitMultiple.toFixed(1),
      exitValuation: results.exitValuation.toFixed(1),
      irr: results.irr.toFixed(1),
      moic: results.moic.toFixed(2),
      cashOnCashReturn: results.cashOnCash.toFixed(1),
    });
  };

  const updateInput = (field: keyof ScenarioInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return `€${value.toFixed(1)}M`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Results Cards */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">IRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {formatPercent(results.irr)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Internal Rate of Return</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">MOIC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {results.moic.toFixed(2)}x
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Multiple on Invested Capital</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Exit Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(results.exitValuation)}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Projected Enterprise Value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">Total Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                {formatCurrency(results.totalReturn)}
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Absolute Profit</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Entry Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Scenario Name</Label>
                <Input
                  value={inputs.name}
                  onChange={(e) => setInputs(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Base Case, Bull Case"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Entry Valuation</Label>
                  <span className="text-sm font-semibold">{formatCurrency(inputs.entryValuation)}</span>
                </div>
                <Slider
                  value={[inputs.entryValuation]}
                  onValueChange={([value]) => updateInput("entryValuation", value)}
                  min={100}
                  max={2000}
                  step={10}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>€100M</span>
                  <span>€2,000M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Stake Percentage</Label>
                  <span className="text-sm font-semibold">{inputs.stakePercentage}%</span>
                </div>
                <Slider
                  value={[inputs.stakePercentage]}
                  onValueChange={([value]) => updateInput("stakePercentage", value)}
                  min={5}
                  max={49}
                  step={1}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>49%</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Investment Amount</span>
                  <span className="text-lg font-bold">{formatCurrency(inputs.investmentAmount)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Debt Financing</Label>
                  <span className="text-sm font-semibold">{inputs.debtPercentage}%</span>
                </div>
                <Slider
                  value={[inputs.debtPercentage]}
                  onValueChange={([value]) => updateInput("debtPercentage", value)}
                  min={0}
                  max={50}
                  step={5}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Operational Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Revenue Growth (Annual)</Label>
                  <span className="text-sm font-semibold">{formatPercent(inputs.revenueGrowthRate)}</span>
                </div>
                <Slider
                  value={[inputs.revenueGrowthRate]}
                  onValueChange={([value]) => updateInput("revenueGrowthRate", value)}
                  min={-5}
                  max={20}
                  step={0.5}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-5%</span>
                  <span>+20%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>EBITDA Margin Improvement</Label>
                  <span className="text-sm font-semibold">{inputs.ebitdaMarginImprovement.toFixed(1)}pp</span>
                </div>
                <Slider
                  value={[inputs.ebitdaMarginImprovement]}
                  onValueChange={([value]) => updateInput("ebitdaMarginImprovement", value)}
                  min={-10}
                  max={15}
                  step={0.5}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-10pp</span>
                  <span>+15pp</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Exit Year</Label>
                  <span className="text-sm font-semibold">{inputs.exitYear} years</span>
                </div>
                <Slider
                  value={[inputs.exitYear]}
                  onValueChange={([value]) => updateInput("exitYear", value)}
                  min={3}
                  max={10}
                  step={1}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 years</span>
                  <span>10 years</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Exit Multiple (EV/EBITDA)</Label>
                  <span className="text-sm font-semibold">{inputs.exitMultiple.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[inputs.exitMultiple]}
                  onValueChange={([value]) => updateInput("exitMultiple", value)}
                  min={5}
                  max={20}
                  step={0.5}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5.0x</span>
                  <span>20.0x</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveScenario}
            disabled={createScenario.isPending}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Save Scenario
          </Button>
        </div>

        {/* Saved Scenarios */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Saved Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading scenarios...</p>
              ) : scenarios && scenarios.length > 0 ? (
                <div className="space-y-3">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{scenario.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">IRR:</span>
                            <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                              {scenario.irr}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">MOIC:</span>
                            <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                              {scenario.moic}x
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stake:</span>
                            <span className="ml-2 font-medium">{scenario.stakePercentage}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Exit:</span>
                            <span className="ml-2 font-medium">{scenario.exitYear}Y</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No saved scenarios yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Adjust the inputs and save your first scenario</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
