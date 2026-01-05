import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { ArrowLeft, TrendingUp } from "lucide-react";

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
                    <div
                      key={deal.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDeals.includes(deal.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleDeal(deal.id)}
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
                              <span className="sr-only">Status:</span>
                              {formatStatus(deal.status)}
                            </Badge>
                            {deal.conviction && (
                              <Badge className={getConvictionBadgeClass(deal.conviction)}>
                                <span className="sr-only">Conviction:</span>
                                {deal.conviction}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {deal.league} • {deal.country}
                          </p>
                        </div>
                      </div>
                    </div>
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
                  <div className="md:hidden space-y-4">
                    {selectedDealsData.map((deal) => (
                      <div key={deal.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold">{deal.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {deal.league || 'N/A'} • {deal.country || 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusBadgeClass(deal.status)}>
                              <span className="sr-only">Status:</span>
                              {formatStatus(deal.status)}
                            </Badge>
                            {deal.conviction ? (
                              <Badge className={getConvictionBadgeClass(deal.conviction)}>
                                <span className="sr-only">Conviction:</span>
                                {deal.conviction}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">Conviction: N/A</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Valuation</p>
                            <p className="font-semibold">{formatCurrency(deal.currentValuation)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p>{formatCurrency(deal.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">EBITDA</p>
                            <p>{formatCurrency(deal.ebitda)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Net Debt</p>
                            <p>{formatCurrency(deal.debt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">EV/EBITDA</p>
                            <p className="font-semibold">{calculateEVEBITDA(deal.currentValuation, deal.ebitda)}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Investment Thesis</p>
                            <p className="text-sm">{deal.investmentThesis || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Key Risks</p>
                            <p className="text-sm">{deal.keyRisks || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block">
                    <div className="overflow-x-auto max-h-[70vh]">
                      <table className="w-full text-sm border-collapse">
                        <caption className="text-left text-muted-foreground py-3">
                          Side-by-side comparison of selected deals across key overview, financial, and thesis metrics.
                        </caption>
                        <thead className="sticky top-0 bg-background z-10">
                          <tr className="border-b">
                            <th scope="col" className="text-left py-3 px-4 font-semibold">Metric</th>
                            {selectedDealsData.map((deal) => (
                              <th
                                scope="col"
                                key={deal.id}
                                className="text-right py-3 px-4 font-semibold bg-background"
                              >
                                {deal.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b bg-muted/30">
                            <th scope="row" className="py-2 px-4 font-medium text-left" colSpan={selectedDealsData.length + 1}>
                              Overview
                            </th>
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">League</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4">
                                {deal.league || 'N/A'}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">Country</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4">
                                {deal.country || 'N/A'}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">Status</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4">
                                <Badge className={getStatusBadgeClass(deal.status)}>
                                  <span className="sr-only">Status:</span>
                                  {formatStatus(deal.status)}
                                </Badge>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">Conviction</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4">
                                {deal.conviction ? (
                                  <Badge className={getConvictionBadgeClass(deal.conviction)}>
                                    <span className="sr-only">Conviction:</span>
                                    {deal.conviction}
                                  </Badge>
                                ) : (
                                  'N/A'
                                )}
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b bg-muted/30">
                            <th scope="row" className="py-2 px-4 font-medium text-left" colSpan={selectedDealsData.length + 1}>
                              Financials
                            </th>
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">Valuation</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4 font-semibold">
                                {formatCurrency(deal.currentValuation)}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">Revenue</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4">
                                {formatCurrency(deal.revenue)}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">EBITDA</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4">
                                {formatCurrency(deal.ebitda)}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">Net Debt</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4">
                                {formatCurrency(deal.debt)}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground text-left">EV/EBITDA</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4 font-semibold">
                                {calculateEVEBITDA(deal.currentValuation, deal.ebitda)}
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b bg-muted/30">
                            <th scope="row" className="py-2 px-4 font-medium text-left" colSpan={selectedDealsData.length + 1}>
                              Investment Thesis
                            </th>
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground align-top text-left">Thesis</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4 text-sm">
                                {deal.investmentThesis || 'N/A'}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <th scope="row" className="py-2 px-4 text-muted-foreground align-top text-left">Key Risks</th>
                            {selectedDealsData.map((deal) => (
                              <td key={deal.id} className="text-right py-2 px-4 text-sm">
                                {deal.keyRisks || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
