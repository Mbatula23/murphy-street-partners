import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Globe, Users, Target } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("core");

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MSP</span>
            </div>
            <span className="font-semibold text-slate-900">Murphy Street Partners</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#strategy" className="text-sm text-slate-600 hover:text-slate-900 transition">Strategy</a>
            <a href="#portfolio" className="text-sm text-slate-600 hover:text-slate-900 transition">Portfolio</a>
            <a href="#team" className="text-sm text-slate-600 hover:text-slate-900 transition">Team</a>
            <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition">Contact</a>
          </div>
          <Button className="bg-blue-700 hover:bg-blue-800">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              $500M Fund | Now Raising
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Strategic Minority Investments in European Sports
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Murphy Street Partners is a London-based investment fund uniquely positioned to generate superior returns by acquiring strategic minority stakes in premium sports assets. We target a <span className="font-semibold">15-20% net IRR</span> and <span className="font-semibold">2.5-3.0x net MOIC</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white">
                View Investment Memo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">$500M</div>
              <p className="text-slate-600">Fund Size Target</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">15-20%</div>
              <p className="text-slate-600">Target Net IRR</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">2.5-3.0x</div>
              <p className="text-slate-600">Target Net MOIC</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">5 Years</div>
              <p className="text-slate-600">Investment Period</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section id="strategy" className="py-20 bg-slate-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Investment Thesis</h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl">
            The European sports landscape presents a compelling opportunity for a specialist investor with deep local expertise and an institutional mindset.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card-premium">
              <Globe className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Market Dislocation</h3>
              <p className="text-slate-600">
                The supply of sophisticated, value-add minority capital in Europe has not kept pace with demand from control owners of premium sports properties.
              </p>
            </div>

            <div className="card-premium">
              <TrendingUp className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Proven Roadmap</h3>
              <p className="text-slate-600">
                The success of minority investing in U.S. major leagues provides a clear playbook now being replicated across Europe.
              </p>
            </div>

            <div className="card-premium">
              <Target className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Fragmented Landscape</h3>
              <p className="text-slate-600">
                Europe's fragmented ecosystem of national leagues creates a barrier to entry for large funds and an advantage for specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Strategy */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Core-Satellite Portfolio Strategy</h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl">
            A disciplined approach to balance stable, long-term value creation with exposure to high-growth verticals.
          </p>

          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("core")}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === "core"
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Core (75-80%)
            </button>
            <button
              onClick={() => setActiveTab("satellite")}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === "satellite"
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Satellite (20-25%)
            </button>
          </div>

          {activeTab === "core" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">European Football</h3>
              <p className="text-slate-700 mb-6">
                Strategic minority stakes (10-25%) in top-tier and high-potential mid-tier European football clubs in the €200M-€800M valuation range.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Value Creation</h4>
                  <ul className="text-slate-600 space-y-2 text-sm">
                    <li>• Commercial growth optimization</li>
                    <li>• Operational improvements</li>
                    <li>• International brand expansion</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Target Assets</h4>
                  <ul className="text-slate-600 space-y-2 text-sm">
                    <li>• Premier League clubs</li>
                    <li>• La Liga & Serie A</li>
                    <li>• Bundesliga & Ligue 1</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Target Returns</h4>
                  <p className="text-slate-600 font-semibold">12-18% Net IRR</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "satellite" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Growth & Income Opportunities</h3>
              <p className="text-slate-700 mb-6">
                Diversified exposure to higher-growth segments and income-generating strategies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Women's Sports (5-10%)</h4>
                  <p className="text-slate-600 text-sm">
                    Venture-style investments in European women's football and NWSL opportunities poised for significant multiple expansion.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Emerging Sports (5-10%)</h4>
                  <p className="text-slate-600 text-sm">
                    High-growth properties in Formula E, padel, and other disruptor leagues with strong digital engagement.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Structured Credit (5-10%)</h4>
                  <p className="text-slate-600 text-sm">
                    Player transfer receivables financing with secured, double-digit returns in a non-correlated segment.
                  </p>
                </div>
              </div>
              <p className="text-slate-600 mt-6 font-semibold">Target Returns: 18-25% Net IRR</p>
            </div>
          )}
        </div>
      </section>

      {/* Why MSP */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Why Murphy Street Partners</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-premium">
              <Users className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Unmatched Expertise</h3>
              <p className="text-slate-600">
                Our leadership team brings a track record of executing the most complex transactions in sports finance, from Manchester United to Real Madrid.
              </p>
            </div>

            <div className="card-premium">
              <Globe className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Proprietary Network</h3>
              <p className="text-slate-600">
                Deep, trusted relationships with decision-makers across Europe's most valuable sports properties provide a continuous pipeline of off-market opportunities.
              </p>
            </div>

            <div className="card-premium">
              <Target className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Local Specialist</h3>
              <p className="text-slate-600">
                London-based with deep European expertise, combined with a global institutional toolkit and U.S. market insights.
              </p>
            </div>

            <div className="card-premium">
              <TrendingUp className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Institutional Discipline</h3>
              <p className="text-slate-600">
                Rigorous underwriting, disciplined risk management, and best-in-class governance make us a trusted partner for control owners and LPs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Leadership Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Michael Batula</h3>
              <p className="text-blue-700 font-semibold mb-4">Managing Partner</p>
              <p className="text-slate-600 leading-relaxed">
                Former Managing Director and Head of Sports Investment Banking for EMEA at J.P. Morgan. Over 20 years of experience in investment banking with over $50 billion of transactions advised. Key deals include Manchester United sale, Sixth Street's Real Madrid partnership, and PIF's McLaren investment.
              </p>
            </div>

            <div className="border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Jonathan Mellor</h3>
              <p className="text-blue-700 font-semibold mb-4">Partner</p>
              <p className="text-slate-600 leading-relaxed">
                Former Director in Sports Investment Banking at J.P. Morgan. Extensive experience in M&A, capital raising, and strategic advisory for sports teams and investors. Deep relationships across European football and motorsport ecosystems with expertise in stadium financing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fund Terms */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Preliminary Fund Terms</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-premium">
              <h3 className="font-semibold text-slate-900 mb-4">Fund Structure</h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex justify-between"><span>Fund Size</span><span className="font-semibold">$500 Million</span></div>
                <div className="flex justify-between"><span>Investment Period</span><span className="font-semibold">5 Years</span></div>
                <div className="flex justify-between"><span>Fund Term</span><span className="font-semibold">10 Years + 2 Extensions</span></div>
                <div className="flex justify-between"><span>Minimum LP Commitment</span><span className="font-semibold">$10 Million</span></div>
              </div>
            </div>

            <div className="card-premium">
              <h3 className="font-semibold text-slate-900 mb-4">Economics</h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex justify-between"><span>Management Fee</span><span className="font-semibold">2.0%</span></div>
                <div className="flex justify-between"><span>Carried Interest</span><span className="font-semibold">20%</span></div>
                <div className="flex justify-between"><span>Hurdle Rate</span><span className="font-semibold">8%</span></div>
                <div className="flex justify-between"><span>Target IRR</span><span className="font-semibold">15-20%</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Invest?</h2>
          <p className="text-lg mb-8 text-blue-100">
            We are seeking a select group of large-ticket Limited Partners to anchor the Fund. Join us in capitalizing on this generational opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              Download Memo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Call
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MSP</span>
                </div>
                <span className="font-semibold text-white">MSP</span>
              </div>
              <p className="text-sm">European sports investment fund focused on strategic minority stakes.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#strategy" className="hover:text-white transition">Strategy</a></li>
                <li><a href="#portfolio" className="hover:text-white transition">Portfolio</a></li>
                <li><a href="#team" className="hover:text-white transition">Team</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Investment Memo</a></li>
                <li><a href="#" className="hover:text-white transition">Fund Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-sm mb-2">London, United Kingdom</p>
              <p className="text-sm">investors@murphystreetpartners.com</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2025 Murphy Street Partners. All rights reserved. This document is confidential.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
