import { Button } from "@/components/ui/button";
import { LogOut, Download, FileText, DollarSign, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Portal() {
  const [, setLocation] = useLocation();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("msp_portal_access");
    if (!access) {
      setLocation("/");
    } else {
      setHasAccess(true);
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("msp_portal_access");
    setLocation("/");
  };

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-sm flex items-center justify-center">
              <span className="text-foreground font-bold text-xs tracking-widest">MSP</span>
            </div>
            <span className="font-semibold text-foreground uppercase tracking-wider text-sm">Investor Portal</span>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-border text-foreground hover:bg-secondary/50 uppercase tracking-wider font-semibold text-xs"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-1 w-12 bg-accent"></div>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest">Confidential</p>
          </div>
          <h1 className="text-foreground mb-6">Welcome to the MSP Investor Portal</h1>
          <p className="text-lg text-foreground/70 font-light">
            Below you will find comprehensive investment materials, fund documentation, and preliminary pipeline information. This content is confidential and intended for qualified investors only.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Investment Memo */}
          <div className="bg-card border border-border rounded-sm p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-6">
              <FileText className="w-8 h-8 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Investment Memorandum</h3>
            <p className="text-foreground/70 mb-8 font-light">
              Complete investment thesis, market opportunity analysis, portfolio strategy, and fund positioning. This document outlines our core-satellite approach and value creation methodology.
            </p>
            <Button className="w-full bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-xs">
              <Download className="w-4 h-4 mr-2" />
              Download Memo
            </Button>
          </div>

          {/* Fund Terms */}
          <div className="bg-card border border-border rounded-sm p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-6">
              <DollarSign className="w-8 h-8 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Fund Terms & Economics</h3>
            <p className="text-foreground/70 mb-8 font-light">
              Detailed fund structure, LP economics, management fees, carried interest, hurdle rates, and preliminary terms. Includes information on minimum commitments and fund timeline.
            </p>
            <Button className="w-full bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-xs">
              <Download className="w-4 h-4 mr-2" />
              Download Terms
            </Button>
          </div>

          {/* Team Bios */}
          <div className="bg-card border border-border rounded-sm p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-6">
              <Users className="w-8 h-8 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Team & Track Record</h3>
            <p className="text-foreground/70 mb-8 font-light">
              Detailed biographies of leadership team, transaction history, relevant experience, and key relationships. Includes references and advisory board information.
            </p>
            <Button className="w-full bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-xs">
              <Download className="w-4 h-4 mr-2" />
              Download Bios
            </Button>
          </div>

          {/* Pipeline Overview */}
          <div className="bg-card border border-border rounded-sm p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-6">
              <FileText className="w-8 h-8 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Highly Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Preliminary Pipeline</h3>
            <p className="text-foreground/70 mb-8 font-light">
              Overview of actionable investment opportunities across our core and satellite verticals. Anonymized deal summaries with investment thesis and value creation drivers.
            </p>
            <Button className="w-full bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-xs">
              <Download className="w-4 h-4 mr-2" />
              Download Pipeline
            </Button>
          </div>
        </div>

        {/* Key Information */}
        <div className="bg-secondary/30 border border-border rounded-sm p-12 mb-16">
          <h2 className="text-foreground mb-12">Fund Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-4">Fund Size</p>
              <p className="text-4xl font-bold text-foreground">$500M</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-4">Target IRR</p>
              <p className="text-4xl font-bold text-foreground">15-20%</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-4">Target MOIC</p>
              <p className="text-4xl font-bold text-foreground">2.5-3.0x</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-4">Investment Period</p>
              <p className="text-4xl font-bold text-foreground">5 Years</p>
            </div>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-card border border-border rounded-sm p-12 mb-16">
          <h2 className="text-foreground mb-12">Portfolio Allocation Strategy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Core (75-80%)</h3>
              <p className="text-foreground/70 mb-6 font-light">
                Strategic minority stakes in top-tier and high-potential European football clubs. Target valuations: €200M-€800M. Expected returns: 12-18% net IRR.
              </p>
              <ul className="space-y-3 text-foreground/70 text-sm font-light">
                <li className="flex items-start gap-3"><span className="text-accent mt-1">•</span> Premier League clubs</li>
                <li className="flex items-start gap-3"><span className="text-accent mt-1">•</span> La Liga & Serie A</li>
                <li className="flex items-start gap-3"><span className="text-accent mt-1">•</span> Bundesliga & Ligue 1</li>
                <li className="flex items-start gap-3"><span className="text-accent mt-1">•</span> High-potential secondary markets</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Satellite (20-25%)</h3>
              <p className="text-foreground/70 mb-6 font-light">
                Diversified exposure to high-growth and income-generating opportunities. Expected returns: 18-25% net IRR.
              </p>
              <ul className="space-y-3 text-foreground/70 text-sm font-light">
                <li className="flex items-start gap-3"><span className="text-accent mt-1">•</span> Women's sports (5-10%)</li>
                <li className="flex items-start gap-3"><span className="text-accent mt-1">•</span> Emerging sports (5-10%)</li>
                <li className="flex items-start gap-3"><span className="text-accent mt-1">•</span> Structured credit (5-10%)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-secondary/50 border border-border rounded-sm p-12">
          <h2 className="text-foreground mb-6">Next Steps</h2>
          <p className="text-foreground/70 mb-8 font-light">
            If you have questions about the fund or would like to discuss a potential investment, please reach out to schedule a call with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-xs">
              Schedule a Call
            </Button>
            <Button variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/5 uppercase tracking-wider font-semibold text-xs">
              investors@murphystreetpartners.com
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
