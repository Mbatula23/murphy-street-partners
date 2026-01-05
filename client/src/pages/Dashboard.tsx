import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Dashboard() {
  const { data: deals, isLoading: dealsLoading } = trpc.deals.list.useQuery();
  const { data: contacts, isLoading: contactsLoading } = trpc.contacts.list.useQuery();
  const { data: activities, isLoading: activitiesLoading } = trpc.activities.list.useQuery();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [convictionFilter, setConvictionFilter] = useState<string[]>([]);
  const [leagueFilter, setLeagueFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"updated" | "valuation">("updated");

  const statusOptions = useMemo(
    () => Array.from(new Set(deals?.map(d => d.status) || [])),
    [deals]
  );

  const convictionOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (deals?.map(d => d.conviction).filter(Boolean) as string[]) || []
        )
      ),
    [deals]
  );

  const leagueOptions = useMemo(
    () => Array.from(new Set(deals?.map(d => d.league).filter(Boolean) || [])),
    [deals]
  );

  const filteredDeals = useMemo(() => {
    if (!deals) return [];

    const appliedFilters = deals.filter(deal => {
      if (statusFilter.length > 0 && !statusFilter.includes(deal.status)) return false;
      if (
        convictionFilter.length > 0 &&
        !convictionFilter.includes(deal.conviction || "")
      )
        return false;
      if (
        leagueFilter.length > 0 &&
        (!deal.league || !leagueFilter.includes(deal.league))
      )
        return false;
      return true;
    });

    return [...appliedFilters].sort((a, b) => {
      if (sortBy === "valuation") {
        return (b.currentValuation || 0) - (a.currentValuation || 0);
      }

      const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [convictionFilter, deals, leagueFilter, sortBy, statusFilter]);

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
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map(status => (
                      <label
                        key={status}
                        className="flex items-center space-x-2 text-sm text-foreground"
                      >
                        <Checkbox
                          checked={statusFilter.includes(status)}
                          onCheckedChange={checked =>
                            setStatusFilter(prev =>
                              checked
                                ? [...prev, status]
                                : prev.filter(s => s !== status)
                            )
                          }
                        />
                        <span>{formatStatus(status)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Conviction</p>
                  <div className="grid grid-cols-2 gap-2">
                    {convictionOptions.map(conviction => (
                      <label
                        key={conviction}
                        className="flex items-center space-x-2 text-sm text-foreground"
                      >
                        <Checkbox
                          checked={convictionFilter.includes(conviction)}
                          onCheckedChange={checked =>
                            setConvictionFilter(prev =>
                              checked
                                ? [...prev, conviction]
                                : prev.filter(c => c !== conviction)
                            )
                          }
                        />
                        <span>{conviction.replace("_", " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">League</p>
                  <div className="grid grid-cols-1 gap-2">
                    {leagueOptions.map(league => (
                      <label
                        key={league}
                        className="flex items-center space-x-2 text-sm text-foreground"
                      >
                        <Checkbox
                          checked={leagueFilter.includes(league)}
                          onCheckedChange={checked =>
                            setLeagueFilter(prev =>
                              checked
                                ? [...prev, league]
                                : prev.filter(l => l !== league)
                            )
                          }
                        />
                        <span>{league}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Sort by</p>
                  <Select value={sortBy} onValueChange={value => setSortBy(value as typeof sortBy)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Last Updated</SelectItem>
                      <SelectItem value="valuation">Valuation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter([]);
                      setConvictionFilter([]);
                      setLeagueFilter([]);
                      setSortBy("updated");
                      setFiltersOpen(false);
                    }}
                  >
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => setFiltersOpen(false)}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {dealsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading deals...</p>
          </div>
        ) : filteredDeals && filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredDeals.map((deal) => (
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
