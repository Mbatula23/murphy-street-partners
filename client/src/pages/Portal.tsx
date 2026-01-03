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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-wider">MSP</span>
            </div>
            <span className="font-semibold text-slate-900">Investor Portal</span>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-slate-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to the MSP Investor Portal</h1>
          <p className="text-lg text-slate-600">
            Below you will find comprehensive investment materials, fund documentation, and preliminary pipeline information. This content is confidential and intended for qualified investors only.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Investment Memo */}
          <div className="bg-white border border-border rounded-lg p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <FileText className="w-8 h-8 text-slate-900" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Investment Memorandum</h3>
            <p className="text-slate-600 mb-6">
              Complete investment thesis, market opportunity analysis, portfolio strategy, and fund positioning. This document outlines our core-satellite approach and value creation methodology.
            </p>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Memo (PDF)
            </Button>
          </div>

          {/* Fund Terms */}
          <div className="bg-white border border-border rounded-lg p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <DollarSign className="w-8 h-8 text-slate-900" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Fund Terms & Economics</h3>
            <p className="text-slate-600 mb-6">
              Detailed fund structure, LP economics, management fees, carried interest, hurdle rates, and preliminary terms. Includes information on minimum commitments and fund timeline.
            </p>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Terms (PDF)
            </Button>
          </div>

          {/* Team Bios */}
          <div className="bg-white border border-border rounded-lg p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <Users className="w-8 h-8 text-slate-900" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Team & Track Record</h3>
            <p className="text-slate-600 mb-6">
              Detailed biographies of leadership team, transaction history, relevant experience, and key relationships. Includes references and advisory board information.
            </p>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Bios (PDF)
            </Button>
          </div>

          {/* Pipeline Overview */}
          <div className="bg-white border border-border rounded-lg p-8 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <FileText className="w-8 h-8 text-slate-900" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Highly Confidential</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Preliminary Pipeline</h3>
            <p className="text-slate-600 mb-6">
              Overview of actionable investment opportunities across our core and satellite verticals. Anonymized deal summaries with investment thesis and value creation drivers.
            </p>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Pipeline (PDF)
            </Button>
          </div>
        </div>

        {/* Key Information */}
        <div className="bg-white border border-border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Fund Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Fund Size</p>
              <p className="text-3xl font-bold text-slate-900">$500M</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Target IRR</p>
              <p className="text-3xl font-bold text-slate-900">15-20%</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Target MOIC</p>
              <p className="text-3xl font-bold text-slate-900">2.5-3.0x</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Investment Period</p>
              <p className="text-3xl font-bold text-slate-900">5 Years</p>
            </div>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-white border border-border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Portfolio Allocation Strategy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Core (75-80%)</h3>
              <p className="text-slate-600 mb-4">
                Strategic minority stakes in top-tier and high-potential European football clubs. Target valuations: €200M-€800M. Expected returns: 12-18% net IRR.
              </p>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>• Premier League clubs</li>
                <li>• La Liga & Serie A</li>
                <li>• Bundesliga & Ligue 1</li>
                <li>• High-potential secondary markets</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Satellite (20-25%)</h3>
              <p className="text-slate-600 mb-4">
                Diversified exposure to high-growth and income-generating opportunities. Expected returns: 18-25% net IRR.
              </p>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>• Women's sports (5-10%)</li>
                <li>• Emerging sports (5-10%)</li>
                <li>• Structured credit (5-10%)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Next Steps</h2>
          <p className="text-slate-600 mb-6">
            If you have questions about the fund or would like to discuss a potential investment, please reach out to schedule a call with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              Schedule a Call
            </Button>
            <Button variant="outline" className="border-slate-300">
              investors@murphystreetpartners.com
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
