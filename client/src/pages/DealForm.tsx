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
import { z } from "zod";
import { dealFormStrings } from "@/strings/dealForm";

type FormData = {
  name: string;
  league: string;
  country: string;
  sport: string;
  status:
    | "monitoring"
    | "warm"
    | "active"
    | "offer_stage"
    | "due_diligence"
    | "closed_won"
    | "closed_lost"
    | "on_hold";
  conviction: "low" | "medium" | "high" | "very_high" | undefined;
  currentValuation: string;
  revenue: string;
  ebitda: string;
  debt: string;
  currentOwner: string;
  ownershipStructure: string;
  targetStakePercentage: string;
  investmentThesis: string;
  keyRisks: string;
  valueCreationOpportunities: string;
  privateNotes: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const optionalText = z
  .string()
  .trim()
  .transform(value => (value === "" ? undefined : value))
  .optional();

const numericText = z
  .string()
  .trim()
  .refine(value => value === "" || !Number.isNaN(Number(value)), {
    message: dealFormStrings.errors.numeric,
  })
  .transform(value => (value === "" ? undefined : value))
  .optional();

const stakeText = z
  .string()
  .trim()
  .refine(value => value === "" || !Number.isNaN(Number(value)), {
    message: dealFormStrings.errors.numeric,
  })
  .refine(value => value === "" || (Number(value) >= 0 && Number(value) <= 100), {
    message: dealFormStrings.errors.stakeRange,
  })
  .transform(value => (value === "" ? undefined : value))
  .optional();

const dealFormSchema = z.object({
  name: z.string().trim().min(1, dealFormStrings.errors.nameRequired),
  league: optionalText,
  country: optionalText,
  sport: z.string().trim(),
  status: z.union([
    z.literal("monitoring"),
    z.literal("warm"),
    z.literal("active"),
    z.literal("offer_stage"),
    z.literal("due_diligence"),
    z.literal("closed_won"),
    z.literal("closed_lost"),
    z.literal("on_hold"),
  ]),
  conviction: z.union([
    z.literal("low"),
    z.literal("medium"),
    z.literal("high"),
    z.literal("very_high"),
  ])
    .optional()
    .transform(value => value ?? undefined),
  currentValuation: numericText,
  revenue: numericText,
  ebitda: numericText,
  debt: numericText,
  currentOwner: optionalText,
  ownershipStructure: optionalText,
  targetStakePercentage: stakeText,
  investmentThesis: optionalText,
  keyRisks: optionalText,
  valueCreationOpportunities: optionalText,
  privateNotes: optionalText,
});

export default function DealForm() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    league: "",
    country: "",
    sport: "football",
    status: "monitoring",
    conviction: undefined,
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
  const [errors, setErrors] = useState<FormErrors>({});

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

    const parsed = dealFormSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues.reduce<FormErrors>((acc, issue) => {
        const field = issue.path[0] as keyof FormData;
        acc[field] = issue.message;
        return acc;
      }, {});

      setErrors(fieldErrors);
      toast.error(dealFormStrings.toasts.validation);
      return;
    }

    setErrors({});
    createDeal.mutate(parsed.data);
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const getDescribedBy = (field: keyof FormData, helperId?: string) => {
    const ids = [] as string[];
    if (helperId) ids.push(helperId);
    if (errors[field]) ids.push(`${field}-error`);
    return ids.length ? ids.join(" ") : undefined;
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
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={getDescribedBy("name")}
                      required
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="text-sm text-destructive mt-1"
                        aria-live="polite"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="league">League</Label>
                      <Input
                        id="league"
                        value={formData.league}
                        onChange={(e) => updateField("league", e.target.value)}
                        placeholder="e.g., La Liga, Serie A"
                        aria-invalid={Boolean(errors.league)}
                        aria-describedby={getDescribedBy("league")}
                      />
                      {errors.league && (
                        <p
                          id="league-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.league}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        placeholder="e.g., Spain, Italy"
                        aria-invalid={Boolean(errors.country)}
                        aria-describedby={getDescribedBy("country")}
                      />
                      {errors.country && (
                        <p
                          id="country-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: any) => updateField("status", value)}>
                        <SelectTrigger aria-describedby={getDescribedBy("status")} aria-invalid={Boolean(errors.status)}>
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
                      {errors.status && (
                        <p
                          id="status-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.status}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="conviction">Conviction</Label>
                      <Select value={formData.conviction} onValueChange={(value: any) => updateField("conviction", value)}>
                        <SelectTrigger
                          aria-describedby={getDescribedBy(
                            "conviction",
                            "conviction-helper",
                          )}
                          aria-invalid={Boolean(errors.conviction)}
                        >
                          <SelectValue placeholder="Select conviction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="very_high">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                      <p
                        id="conviction-helper"
                        className="text-sm text-muted-foreground mt-1"
                      >
                        {dealFormStrings.helperText.conviction}
                      </p>
                      {errors.conviction && (
                        <p
                          id="conviction-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.conviction}
                        </p>
                      )}
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
                        min={0}
                        step="0.01"
                        aria-invalid={Boolean(errors.currentValuation)}
                        aria-describedby={getDescribedBy(
                          "currentValuation",
                          "currentValuation-helper",
                        )}
                      />
                      <p
                        id="currentValuation-helper"
                        className="text-sm text-muted-foreground mt-1"
                      >
                        {dealFormStrings.helperText.valuation}
                      </p>
                      {errors.currentValuation && (
                        <p
                          id="currentValuation-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.currentValuation}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="revenue">Annual Revenue (€M)</Label>
                      <Input
                        id="revenue"
                        value={formData.revenue}
                        onChange={(e) => updateField("revenue", e.target.value)}
                        placeholder="e.g., 150"
                        type="number"
                        min={0}
                        step="0.01"
                        aria-invalid={Boolean(errors.revenue)}
                        aria-describedby={getDescribedBy("revenue")}
                      />
                      {errors.revenue && (
                        <p
                          id="revenue-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.revenue}
                        </p>
                      )}
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
                        min={0}
                        step="0.01"
                        aria-invalid={Boolean(errors.ebitda)}
                        aria-describedby={getDescribedBy("ebitda")}
                      />
                      {errors.ebitda && (
                        <p
                          id="ebitda-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.ebitda}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="debt">Net Debt (€M)</Label>
                      <Input
                        id="debt"
                        value={formData.debt}
                        onChange={(e) => updateField("debt", e.target.value)}
                        placeholder="e.g., 200"
                        type="number"
                        min={0}
                        step="0.01"
                        aria-invalid={Boolean(errors.debt)}
                        aria-describedby={getDescribedBy("debt")}
                      />
                      {errors.debt && (
                        <p
                          id="debt-error"
                          className="text-sm text-destructive mt-1"
                          aria-live="polite"
                        >
                          {errors.debt}
                        </p>
                      )}
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
                      aria-invalid={Boolean(errors.currentOwner)}
                      aria-describedby={getDescribedBy("currentOwner")}
                    />
                    {errors.currentOwner && (
                      <p
                        id="currentOwner-error"
                        className="text-sm text-destructive mt-1"
                        aria-live="polite"
                      >
                        {errors.currentOwner}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ownershipStructure">Ownership Structure</Label>
                    <Textarea
                      id="ownershipStructure"
                      value={formData.ownershipStructure}
                      onChange={(e) => updateField("ownershipStructure", e.target.value)}
                      placeholder="Describe the ownership structure..."
                      rows={3}
                      aria-invalid={Boolean(errors.ownershipStructure)}
                      aria-describedby={getDescribedBy("ownershipStructure")}
                    />
                    {errors.ownershipStructure && (
                      <p
                        id="ownershipStructure-error"
                        className="text-sm text-destructive mt-1"
                        aria-live="polite"
                      >
                        {errors.ownershipStructure}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="targetStakePercentage">Target Stake (%)</Label>
                    <Input
                      id="targetStakePercentage"
                      value={formData.targetStakePercentage}
                      onChange={(e) => updateField("targetStakePercentage", e.target.value)}
                      placeholder="e.g., 15"
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      aria-invalid={Boolean(errors.targetStakePercentage)}
                      aria-describedby={getDescribedBy(
                        "targetStakePercentage",
                        "targetStakePercentage-helper",
                      )}
                    />
                    <p
                      id="targetStakePercentage-helper"
                      className="text-sm text-muted-foreground mt-1"
                    >
                      {dealFormStrings.helperText.stake}
                    </p>
                    {errors.targetStakePercentage && (
                      <p
                        id="targetStakePercentage-error"
                        className="text-sm text-destructive mt-1"
                        aria-live="polite"
                      >
                        {errors.targetStakePercentage}
                      </p>
                    )}
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
                    aria-invalid={Boolean(errors.investmentThesis)}
                    aria-describedby={getDescribedBy("investmentThesis")}
                  />
                  {errors.investmentThesis && (
                    <p
                      id="investmentThesis-error"
                      className="text-sm text-destructive mt-1"
                      aria-live="polite"
                    >
                      {errors.investmentThesis}
                    </p>
                  )}
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
                    aria-invalid={Boolean(errors.keyRisks)}
                    aria-describedby={getDescribedBy("keyRisks")}
                  />
                  {errors.keyRisks && (
                    <p
                      id="keyRisks-error"
                      className="text-sm text-destructive mt-1"
                      aria-live="polite"
                    >
                      {errors.keyRisks}
                    </p>
                  )}
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
                    aria-invalid={Boolean(errors.valueCreationOpportunities)}
                    aria-describedby={getDescribedBy("valueCreationOpportunities")}
                  />
                  {errors.valueCreationOpportunities && (
                    <p
                      id="valueCreationOpportunities-error"
                      className="text-sm text-destructive mt-1"
                      aria-live="polite"
                    >
                      {errors.valueCreationOpportunities}
                    </p>
                  )}
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
                    aria-invalid={Boolean(errors.privateNotes)}
                    aria-describedby={getDescribedBy("privateNotes")}
                  />
                  {errors.privateNotes && (
                    <p
                      id="privateNotes-error"
                      className="text-sm text-destructive mt-1"
                      aria-live="polite"
                    >
                      {errors.privateNotes}
                    </p>
                  )}
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
