import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Edit, TrendingUp, Users, FileText, Calculator } from "lucide-react";
import ScenarioModeler from "@/components/ScenarioModeler";

export default function DealDetail() {
  const [, params] = useRoute("/deals/:id");
  const [, setLocation] = useLocation();
  const dealId = params?.id ? parseInt(params.id) : 0;

  const { data: deal, isLoading } = trpc.deals.get.useQuery({ id: dealId });

  const getStatusBadgeClass = (status: string) => {
    return `status-${status}`;
  };

  const getConvictionBadgeClass = (conviction: string | null) => {
    if (!conviction) return "conviction-medium";
    return `conviction-${conviction}`;
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "—";
    return `€${parseFloat(value).toLocaleString()}M`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading deal...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Deal not found</h2>
          <Button onClick={() => setLocation("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pipeline
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{deal.name}</h1>
                <Badge className={`${getStatusBadgeClass(deal.status)}`}>
                  {formatStatus(deal.status)}
                </Badge>
                {deal.conviction && (
                  <Badge className={`${getConvictionBadgeClass(deal.conviction)}`}>
                    {deal.conviction.replace("_", " ")}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                {deal.league && <span>{deal.league}</span>}
                {deal.country && <span>• {deal.country}</span>}
                {deal.sport && <span>• {deal.sport}</span>}
              </div>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <FileText className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="scenarios">
              <Calculator className="w-4 h-4 mr-2" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="financials">
              <TrendingUp className="w-4 h-4 mr-2" />
              Financials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valuation</span>
                    <span className="font-semibold">{formatCurrency(deal.currentValuation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-semibold">{formatCurrency(deal.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EBITDA</span>
                    <span className="font-semibold">{formatCurrency(deal.ebitda)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Debt</span>
                    <span className="font-semibold">{formatCurrency(deal.debt)}</span>
                  </div>
                  {deal.ebitda && deal.currentValuation && (
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-muted-foreground">EV/EBITDA</span>
                      <span className="font-semibold">
                        {(parseFloat(deal.currentValuation) / parseFloat(deal.ebitda)).toFixed(1)}x
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ownership */}
              <Card>
                <CardHeader>
                  <CardTitle>Ownership</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Current Owner</span>
                    <span className="font-medium">{deal.currentOwner || "—"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Target Stake</span>
                    <span className="font-medium">{deal.targetStakePercentage ? `${deal.targetStakePercentage}%` : "—"}</span>
                  </div>
                  {deal.ownershipStructure && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Structure</span>
                      <p className="text-sm">{deal.ownershipStructure}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key Dates */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deal.lastContactDate && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Last Contact</span>
                      <span className="font-medium">
                        {new Date(deal.lastContactDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {deal.nextFollowUpDate && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Next Follow-up</span>
                      <span className="font-medium">
                        {new Date(deal.nextFollowUpDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {deal.mediaRightsExpiry && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Media Rights Expiry</span>
                      <span className="font-medium">
                        {new Date(deal.mediaRightsExpiry).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Investment Thesis */}
            {deal.investmentThesis && (
              <Card>
                <CardHeader>
                  <CardTitle>Investment Thesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{deal.investmentThesis}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Risks */}
              {deal.keyRisks && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Risks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">{deal.keyRisks}</p>
                  </CardContent>
                </Card>
              )}

              {/* Value Creation */}
              {deal.valueCreationOpportunities && (
                <Card>
                  <CardHeader>
                    <CardTitle>Value Creation Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">{deal.valueCreationOpportunities}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Private Notes */}
            {deal.privateNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Private Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{deal.privateNotes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="scenarios">
            <ScenarioModeler dealId={dealId} deal={deal} />
          </TabsContent>

          <TabsContent value="financials">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Financials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Enterprise Value</span>
                      <span className="text-2xl font-bold">{formatCurrency(deal.currentValuation)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Annual Revenue</span>
                      <span className="text-2xl font-bold">{formatCurrency(deal.revenue)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">EBITDA</span>
                      <span className="text-2xl font-bold">{formatCurrency(deal.ebitda)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Net Debt</span>
                      <span className="text-2xl font-bold">{formatCurrency(deal.debt)}</span>
                    </div>
                  </div>

                  {deal.revenue && deal.ebitda && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Key Metrics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">EBITDA Margin</span>
                          <span className="text-lg font-semibold">
                            {((parseFloat(deal.ebitda) / parseFloat(deal.revenue)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        {deal.currentValuation && (
                          <>
                            <div>
                              <span className="text-sm text-muted-foreground block mb-1">EV/Revenue</span>
                              <span className="text-lg font-semibold">
                                {(parseFloat(deal.currentValuation) / parseFloat(deal.revenue)).toFixed(1)}x
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground block mb-1">EV/EBITDA</span>
                              <span className="text-lg font-semibold">
                                {(parseFloat(deal.currentValuation) / parseFloat(deal.ebitda)).toFixed(1)}x
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
