import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function DealForm() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    name: "",
    league: "",
    country: "",
    sport: "football",
    status: "monitoring" as const,
    conviction: undefined as "low" | "medium" | "high" | "very_high" | undefined,
    currentValuation: "",
    revenue: "",
    ebitda: "",
    debt: "",
    currentOwner: "",
    ownershipStructure: "",
    targetStakePercentage: "",
    investmentThesis: "",
    keyRisks: "",
    valueCreationOpportunities: "",
    privateNotes: "",
  });

  const createDeal = trpc.deals.create.useMutation({
    onSuccess: () => {
      toast.success("Deal created successfully");
      utils.deals.list.invalidate();
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(`Failed to create deal: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Deal name is required");
      return;
    }

    createDeal.mutate(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          <h1 className="text-3xl font-bold text-foreground">New Deal</h1>
          <p className="text-muted-foreground mt-1">Add a new opportunity to your pipeline</p>
        </div>
      </div>

      {/* Form */}
      <div className="container py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Deal Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g., FC Barcelona, Juventus FC"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="league">League</Label>
                      <Input
                        id="league"
                        value={formData.league}
                        onChange={(e) => updateField("league", e.target.value)}
                        placeholder="e.g., La Liga, Serie A"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        placeholder="e.g., Spain, Italy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: any) => updateField("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                          <SelectItem value="warm">Warm</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="offer_stage">Offer Stage</SelectItem>
                          <SelectItem value="due_diligence">Due Diligence</SelectItem>
                          <SelectItem value="closed_won">Closed Won</SelectItem>
                          <SelectItem value="closed_lost">Closed Lost</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="conviction">Conviction</Label>
                      <Select value={formData.conviction} onValueChange={(value: any) => updateField("conviction", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select conviction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="very_high">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentValuation">Current Valuation (€M)</Label>
                      <Input
                        id="currentValuation"
                        value={formData.currentValuation}
                        onChange={(e) => updateField("currentValuation", e.target.value)}
                        placeholder="e.g., 500"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="revenue">Annual Revenue (€M)</Label>
                      <Input
                        id="revenue"
                        value={formData.revenue}
                        onChange={(e) => updateField("revenue", e.target.value)}
                        placeholder="e.g., 150"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ebitda">EBITDA (€M)</Label>
                      <Input
                        id="ebitda"
                        value={formData.ebitda}
                        onChange={(e) => updateField("ebitda", e.target.value)}
                        placeholder="e.g., 45"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="debt">Net Debt (€M)</Label>
                      <Input
                        id="debt"
                        value={formData.debt}
                        onChange={(e) => updateField("debt", e.target.value)}
                        placeholder="e.g., 200"
                        type="number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ownership & Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentOwner">Current Owner</Label>
                    <Input
                      id="currentOwner"
                      value={formData.currentOwner}
                      onChange={(e) => updateField("currentOwner", e.target.value)}
                      placeholder="e.g., Agnelli Family, Private Consortium"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ownershipStructure">Ownership Structure</Label>
                    <Textarea
                      id="ownershipStructure"
                      value={formData.ownershipStructure}
                      onChange={(e) => updateField("ownershipStructure", e.target.value)}
                      placeholder="Describe the ownership structure..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetStakePercentage">Target Stake (%)</Label>
                    <Input
                      id="targetStakePercentage"
                      value={formData.targetStakePercentage}
                      onChange={(e) => updateField("targetStakePercentage", e.target.value)}
                      placeholder="e.g., 15"
                      type="number"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Thesis & Notes */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Thesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.investmentThesis}
                    onChange={(e) => updateField("investmentThesis", e.target.value)}
                    placeholder="Why is this an attractive opportunity?"
                    rows={6}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Risks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.keyRisks}
                    onChange={(e) => updateField("keyRisks", e.target.value)}
                    placeholder="What are the main risks?"
                    rows={6}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Value Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.valueCreationOpportunities}
                    onChange={(e) => updateField("valueCreationOpportunities", e.target.value)}
                    placeholder="How will we create value?"
                    rows={6}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Private Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.privateNotes}
                    onChange={(e) => updateField("privateNotes", e.target.value)}
                    placeholder="Internal notes..."
                    rows={6}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createDeal.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createDeal.isPending ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
