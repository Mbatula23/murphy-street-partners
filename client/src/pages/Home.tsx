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
    if (password === "msp2025") {
      localStorage.setItem("msp_portal_access", "true");
      setLocation("/portal");
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-sm flex items-center justify-center">
              <span className="text-foreground font-bold text-xs tracking-widest">MSP</span>
            </div>
            <span className="font-semibold text-foreground tracking-tight text-sm uppercase letter-spacing">Murphy Street Partners</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-foreground/70 hover:text-foreground transition uppercase tracking-wider">About</a>
            <a href="#team" className="text-sm text-foreground/70 hover:text-foreground transition uppercase tracking-wider">Team</a>
            <a href="#contact" className="text-sm text-foreground/70 hover:text-foreground transition uppercase tracking-wider">Contact</a>
          </div>
          <Button 
            onClick={() => setShowLoginModal(true)}
            className="bg-foreground hover:bg-foreground/90 text-background text-xs uppercase tracking-wider font-semibold"
          >
            Investor Portal
          </Button>
        </div>
      </nav>

      {/* Hero Section - Commanding */}
      <section className="relative py-32 md:py-48 bg-background overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="accent-line"></div>
              <span className="text-xs font-semibold text-foreground/60 uppercase tracking-widest">European Sports</span>
            </div>
            <h1 className="text-foreground mb-8 leading-tight">
              Strategic Capital for Premium Assets
            </h1>
            <p className="text-lg text-foreground/70 mb-12 leading-relaxed max-w-2xl font-light">
              Murphy Street Partners deploys institutional capital into strategic minority positions across Europe's most valuable sports properties. We are selective about our capital and our partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-sm"
                onClick={() => setShowLoginModal(true)}
              >
                Access Investor Materials <Lock className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-foreground/30 text-foreground hover:bg-foreground/5 uppercase tracking-wider font-semibold text-sm"
              >
                Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials - Minimal, Powerful */}
      <section className="py-20 bg-secondary/50 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
              <p className="text-4xl font-bold text-foreground mb-2">$50B+</p>
              <p className="text-sm text-foreground/70 uppercase tracking-wider">Transactions Advised</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground mb-2">20+</p>
              <p className="text-sm text-foreground/70 uppercase tracking-wider">Years Combined Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground mb-2">Landmark</p>
              <p className="text-sm text-foreground/70 uppercase tracking-wider">Manchester United, Real Madrid, McLaren</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container max-w-3xl">
          <div className="mb-12 flex items-center gap-3">
            <div className="accent-line"></div>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest">About</p>
          </div>
          <h2 className="text-foreground mb-12">
            Specialized Expertise in European Sports
          </h2>
          
          <div className="space-y-8 text-foreground/70 leading-relaxed font-light">
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
      <section id="team" className="py-24 bg-secondary/30">
        <div className="container">
          <div className="mb-12 flex items-center gap-3">
            <div className="accent-line"></div>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest">Leadership</p>
          </div>
          <h2 className="text-foreground mb-16">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-card border border-border rounded-sm p-12">
              <h3 className="text-2xl font-bold text-foreground mb-1">Michael Batula</h3>
              <p className="text-accent font-semibold mb-8 uppercase tracking-wider text-xs">Managing Partner</p>
              <p className="text-foreground/70 leading-relaxed font-light">
                Former Managing Director and Head of Sports Investment Banking, EMEA at J.P. Morgan. 20+ years in investment banking with expertise across sports, media, and technology M&A. Advised on landmark transactions including Manchester United, Real Madrid, and McLaren Group.
              </p>
            </div>

            <div className="bg-card border border-border rounded-sm p-12">
              <h3 className="text-2xl font-bold text-foreground mb-1">Jonathan Mellor</h3>
              <p className="text-accent font-semibold mb-8 uppercase tracking-wider text-xs">Partner</p>
              <p className="text-foreground/70 leading-relaxed font-light">
                Former Director, Sports Investment Banking at J.P. Morgan. Deep expertise in M&A, capital raising, and strategic advisory for sports teams and investors across Europe. Extensive experience in stadium financing and sports infrastructure projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background border-t border-border">
        <div className="container max-w-2xl text-center">
          <div className="mb-12 flex items-center justify-center gap-3">
            <div className="accent-line"></div>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest">Get in Touch</p>
            <div className="accent-line"></div>
          </div>
          <h2 className="text-foreground mb-8">
            Interested in Learning More?
          </h2>
          <p className="text-lg text-foreground/70 mb-12 font-light">
            We welcome inquiries from qualified investors. For investor materials and to schedule a discussion, please reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-sm">
              investors@murphystreetpartners.com
            </Button>
            <Button size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/5 uppercase tracking-wider font-semibold text-sm">
              +44 (0) 20 XXXX XXXX
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 border-t border-foreground/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
                  <span className="text-foreground font-bold text-xs">MSP</span>
                </div>
                <span className="font-semibold text-background uppercase tracking-wider text-xs">MSP</span>
              </div>
              <p className="text-sm text-background/70 font-light">European sports investment fund focused on strategic minority stakes in premium assets.</p>
            </div>
            <div>
              <h4 className="font-semibold text-background mb-4 uppercase tracking-wider text-xs">Navigation</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#about" className="hover:text-background transition">About</a></li>
                <li><a href="#team" className="hover:text-background transition">Team</a></li>
                <li><a href="#contact" className="hover:text-background transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-background mb-4 uppercase tracking-wider text-xs">Location</h4>
              <p className="text-sm text-background/70 font-light mb-2">London, United Kingdom</p>
              <p className="text-sm text-background/70 font-light">investors@murphystreetpartners.com</p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-sm text-center text-background/70 font-light">
            <p>&copy; 2025 Murphy Street Partners. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-sm p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-foreground mb-6">Investor Portal</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wider">
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
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                />
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold text-sm"
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
                  className="flex-1 border-foreground/30"
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
