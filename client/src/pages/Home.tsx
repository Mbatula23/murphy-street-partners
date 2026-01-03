import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-sm flex items-center justify-center mx-auto mb-4">
              <span className="text-foreground font-bold tracking-widest">MSP</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Murphy Street Partners</h1>
            <p className="text-foreground/70">Deal Sourcing Platform</p>
          </div>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-foreground hover:bg-foreground/90 text-background uppercase tracking-wider font-semibold"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Redirect to dashboard (will be implemented next)
  window.location.href = "/dashboard";
  return null;
}
