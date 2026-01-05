import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { ArrowLeft, TrendingUp } from "lucide-react";

export const isDealToggleKey = (key: string) => key === "Enter" || key === " ";

export const handleDealKeyboardToggle = (
  event: Pick<React.KeyboardEvent, "key" | "preventDefault">,
  onToggle: () => void,
) => {
  if (isDealToggleKey(event.key)) {
    event.preventDefault();
    onToggle();
    return true;
  }

  return false;
};

export default function DealComparison() {
  const [, setLocation] = useLocation();
  const { data: deals, isLoading } = trpc.deals.list.useQuery();
  const [selectedDeals, setSelectedDeals] = useState<number[]>([]);

  const toggleDeal = (dealId: number) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const selectedDealsData = deals?.filter(d => selectedDeals.includes(d.id)) || [];

  const formatCurrency = (value: string | null) => {
    return value ? `€${value}M` : 'N/A';
  };

  const formatPercent = (value: string | null) => {
    return value ? `${value}%` : 'N/A';
  };

  const calculateEVEBITDA = (valuation: string | null, ebitda: string | null) => {
    if (!valuation || !ebitda) return 'N/A';
    const val = parseFloat(valuation);
    const ebit = parseFloat(ebitda);
    if (ebit === 0) return 'N/A';
    return `${(val / ebit).toFixed(1)}x`;
  };

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

  const handleDealKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    dealId: number
  ) => {
    handleDealKeyboardToggle(event, () => toggleDeal(dealId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pipeline
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deal Comparison</h1>
          <p className="text-muted-foreground">
            Select deals to compare side-by-side
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading deals...</p>
          </div>
        ) : !deals || deals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No deals available to compare</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Deal Selection */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Deals ({selectedDeals.length} selected)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deals.map((deal) => (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={selectedDeals.includes(deal.id)}
                      key={deal.id}
                      className={`p-4 border rounded-lg text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        selectedDeals.includes(deal.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleDeal(deal.id)}
                      onKeyDown={(event) => handleDealKeyDown(event, deal.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedDeals.includes(deal.id)}
                          onCheckedChange={() => toggleDeal(deal.id)}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{deal.name}</h3>
                          <div className="flex gap-2 mb-2">
                            <Badge className={getStatusBadgeClass(deal.status)}>
                              {formatStatus(deal.status)}
                            </Badge>
                            {deal.conviction && (
                              <Badge className={getConvictionBadgeClass(deal.conviction)}>
                                {deal.conviction}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {deal.league} • {deal.country}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comparison Table */}
            {selectedDealsData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Side-by-Side Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Metric</th>
                          {selectedDealsData.map((deal) => (
                            <th key={deal.id} className="text-right py-3 px-4 font-semibold">
                              {deal.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b bg-muted/30">
                          <td className="py-2 px-4 font-medium" colSpan={selectedDealsData.length + 1}>
                            Overview
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">League</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4">
                              {deal.league || 'N/A'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">Country</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4">
                              {deal.country || 'N/A'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">Status</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4">
                              <Badge className={getStatusBadgeClass(deal.status)}>
                                {formatStatus(deal.status)}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">Conviction</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4">
                              {deal.conviction ? (
                                <Badge className={getConvictionBadgeClass(deal.conviction)}>
                                  {deal.conviction}
                                </Badge>
                              ) : (
                                'N/A'
                              )}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b bg-muted/30">
                          <td className="py-2 px-4 font-medium" colSpan={selectedDealsData.length + 1}>
                            Financials
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">Valuation</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4 font-semibold">
                              {formatCurrency(deal.currentValuation)}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">Revenue</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4">
                              {formatCurrency(deal.revenue)}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">EBITDA</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4">
                              {formatCurrency(deal.ebitda)}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">Net Debt</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4">
                              {formatCurrency(deal.debt)}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground">EV/EBITDA</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4 font-semibold">
                              {calculateEVEBITDA(deal.currentValuation, deal.ebitda)}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b bg-muted/30">
                          <td className="py-2 px-4 font-medium" colSpan={selectedDealsData.length + 1}>
                            Investment Thesis
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground align-top">Thesis</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4 text-sm">
                              {deal.investmentThesis || 'N/A'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4 text-muted-foreground align-top">Key Risks</td>
                          {selectedDealsData.map((deal) => (
                            <td key={deal.id} className="text-right py-2 px-4 text-sm">
                              {deal.keyRisks || 'N/A'}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
