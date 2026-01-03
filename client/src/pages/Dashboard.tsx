import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Target, 
  Activity,
  ArrowRight,
  Filter
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: deals, isLoading: dealsLoading } = trpc.deals.list.useQuery();
  const { data: contacts, isLoading: contactsLoading } = trpc.contacts.list.useQuery();
  const { data: activities, isLoading: activitiesLoading } = trpc.activities.list.useQuery();

  const activeDeals = deals?.filter(d => 
    ["warm", "active", "offer_stage", "due_diligence"].includes(d.status)
  ) || [];

  const highConvictionDeals = deals?.filter(d => 
    ["high", "very_high"].includes(d.conviction || "")
  ) || [];

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
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Deal Pipeline</h1>
              <p className="text-muted-foreground">Strategic minority investments across European sports</p>
            </div>
            <div className="flex gap-2">
              <Link href="/comparison">
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Compare Deals
                </Button>
              </Link>
              <Link href="/deals/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  New Deal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deals?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeDeals.length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Conviction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highConvictionDeals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Priority targets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Network relationships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activities?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Deals List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Active Pipeline</h2>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {dealsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading deals...</p>
          </div>
        ) : deals && deals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {deals.map((deal) => (
              <Link key={deal.id} href={`/deals/${deal.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{deal.name}</h3>
                          <Badge className={`${getStatusBadgeClass(deal.status)} text-xs`}>
                            {formatStatus(deal.status)}
                          </Badge>
                          {deal.conviction && (
                            <Badge className={`${getConvictionBadgeClass(deal.conviction)} text-xs`}>
                              {deal.conviction.replace("_", " ")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {deal.league && <span>{deal.league}</span>}
                          {deal.country && <span>• {deal.country}</span>}
                          {deal.currentValuation && <span>• €{deal.currentValuation}M valuation</span>}
                        </div>
                        {deal.investmentThesis && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {deal.investmentThesis}
                          </p>
                        )}
                        {deal.updatedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Updated {formatDistanceToNow(new Date(deal.updatedAt), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground ml-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No deals yet</h3>
              <p className="text-muted-foreground mb-6">Start building your pipeline by adding your first deal</p>
              <Link href="/deals/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Deal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
