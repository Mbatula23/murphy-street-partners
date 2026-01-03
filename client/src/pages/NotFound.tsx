import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-8">Page not found</p>
        <Button 
          onClick={() => setLocation("/")}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Home className="w-4 h-4 mr-2" />
          Return Home
        </Button>
      </div>
    </div>
  );
}
