import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, this would be proper auth)
    if (password === "msp2025") {
      localStorage.setItem("msp_portal_access", "true");
      setLocation("/portal");
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-wider">MSP</span>
            </div>
            <span className="font-semibold text-slate-900 tracking-tight">Murphy Street Partners</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-slate-600 hover:text-slate-900 transition">About</a>
            <a href="#team" className="text-sm text-slate-600 hover:text-slate-900 transition">Team</a>
            <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition">Contact</a>
          </div>
          <Button 
            onClick={() => setShowLoginModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Investor Portal
          </Button>
        </div>
      </nav>

      {/* Hero Section - Minimal, Powerful */}
      <section className="relative py-32 md:py-48 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="mb-8">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">European Sports Investment</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
              Strategic Capital for Premium Assets
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-xl">
              Murphy Street Partners deploys institutional capital into strategic minority positions across Europe's most valuable sports properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={() => setShowLoginModal(true)}
              >
                Access Investor Materials <Lock className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-300 text-slate-900 hover:bg-slate-50"
              >
                Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-20 bg-slate-50 border-y border-border">
        <div className="container">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-12">Our Track Record</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">$50B+</h3>
              <p className="text-slate-600">Transactions advised across sports, media, and technology</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">20+ Years</h3>
              <p className="text-slate-600">Combined experience in investment banking and sports finance</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Landmark Deals</h3>
              <p className="text-slate-600">Manchester United, Real Madrid, McLaren Group, and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container max-w-3xl">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">About</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-8">Specialized Expertise in European Sports</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Murphy Street Partners is a London-based investment fund focused on acquiring strategic minority stakes in premium European sports assets. We combine deep institutional expertise with a proprietary network across Europe's most valuable properties.
            </p>
            <p>
              Our team brings unparalleled transactional experience from the highest levels of investment banking, having advised on the most complex and innovative deals in sports finance. We understand the unique challenges of sports investment and the opportunities that emerge when strategic capital meets operational excellence.
            </p>
            <p>
              We are selective about our capital deployment and our partnerships. We invest only in situations where we have clear conviction in our ability to drive meaningful value creation alongside control owners who share our vision for growth.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-slate-50">
        <div className="container">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Leadership</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Michael Batula</h3>
              <p className="text-slate-500 font-semibold mb-6">Managing Partner</p>
              <p className="text-slate-600 leading-relaxed">
                Former Managing Director and Head of Sports Investment Banking, EMEA at J.P. Morgan. 20+ years in investment banking with expertise across sports, media, and technology M&A.
              </p>
            </div>

            <div className="bg-white border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Jonathan Mellor</h3>
              <p className="text-slate-500 font-semibold mb-6">Partner</p>
              <p className="text-slate-600 leading-relaxed">
                Former Director, Sports Investment Banking at J.P. Morgan. Deep expertise in M&A, capital raising, and strategic advisory for sports teams and investors across Europe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-border">
        <div className="container max-w-2xl text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Get in Touch</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Interested in Learning More?</h2>
          <p className="text-lg text-slate-600 mb-12">
            We welcome inquiries from qualified investors. For investor materials and to schedule a discussion, please reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
              investors@murphystreetpartners.com
            </Button>
            <Button size="lg" variant="outline" className="border-slate-300">
              +44 (0) 20 XXXX XXXX
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MSP</span>
                </div>
                <span className="font-semibold text-white">MSP</span>
              </div>
              <p className="text-sm">European sports investment fund focused on strategic minority stakes in premium assets.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#team" className="hover:text-white transition">Team</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Location</h4>
              <p className="text-sm mb-2">London, United Kingdom</p>
              <p className="text-sm">investors@murphystreetpartners.com</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2025 Murphy Street Partners. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Investor Portal</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Access Code
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter access code"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Access Portal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPassword("");
                    setError("");
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
