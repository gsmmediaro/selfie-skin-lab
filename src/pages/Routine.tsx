import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sun, Moon, Droplet, Sparkles } from "lucide-react";
import { getScanById } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { toast } from "sonner";

const Routine = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<SkinAnalysis | null>(null);

  useEffect(() => {
    if (!scanId) {
      navigate("/");
      return;
    }

    const scanData = getScanById(scanId);
    if (!scanData) {
      toast.error("Scan not found");
      navigate("/");
      return;
    }

    if (!scanData.unlocked) {
      toast.error("Please unlock this scan first");
      navigate(`/results/${scanId}`);
      return;
    }

    setScan(scanData);
  }, [scanId, navigate]);

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-glow-pulse">Loading...</div>
      </div>
    );
  }

  // Get focus areas based on lowest scores
  const metricScores = Object.entries(scan.metrics).map(([key, value]) => ({
    name: key,
    score: value.score,
  }));
  const sortedMetrics = [...metricScores].sort((a, b) => a.score - b.score);
  const focusAreas = sortedMetrics.slice(0, 2).map(m => m.name);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold bg-gradient-glow bg-clip-text text-transparent"
          >
            SkinScan
          </button>
          <Button onClick={() => navigate(`/analysis/${scanId}`)} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold">Your Personalized Skincare Routine</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Based on your Glow Score of {scan.glowScore}, we've created a custom routine targeting your focus areas: {focusAreas.join(" and ")}.
          </p>
        </section>

        {/* Morning Routine */}
        <section className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-warning/20 rounded-xl">
              <Sun className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-3xl font-bold">Morning Routine</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Droplet className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">1. Gentle Cleanser</h3>
                  <p className="text-muted-foreground mb-3">
                    Start with a pH-balanced cleanser to remove overnight oils without stripping your skin.
                  </p>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-foreground mb-1">Recommended:</p>
                    <p className="text-muted-foreground">CeraVe Hydrating Facial Cleanser or La Roche-Posay Toleriane</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">2. Vitamin C Serum</h3>
                  <p className="text-muted-foreground mb-3">
                    Brightens skin, reduces dark spots, and provides antioxidant protection.
                  </p>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-foreground mb-1">Recommended:</p>
                    <p className="text-muted-foreground">SkinCeuticals C E Ferulic or The Ordinary Vitamin C Suspension 23%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Droplet className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">3. Moisturizer</h3>
                  <p className="text-muted-foreground mb-3">
                    Lock in hydration and create a protective barrier.
                  </p>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-foreground mb-1">Recommended:</p>
                    <p className="text-muted-foreground">Neutrogena Hydro Boost or Clinique Dramatically Different</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-warning/10 p-3 rounded-xl">
                  <Sun className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">4. SPF 30+ Sunscreen</h3>
                  <p className="text-muted-foreground mb-3">
                    Essential final step - protects against UV damage and prevents aging.
                  </p>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-foreground mb-1">Recommended:</p>
                    <p className="text-muted-foreground">EltaMD UV Clear SPF 46 or Supergoop! Unseen Sunscreen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Evening Routine */}
        <section className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Evening Routine</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Droplet className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">1. Double Cleanse</h3>
                  <p className="text-muted-foreground mb-3">
                    First with an oil cleanser to remove makeup/sunscreen, then your regular cleanser.
                  </p>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-foreground mb-1">Recommended:</p>
                    <p className="text-muted-foreground">DHC Deep Cleansing Oil + your morning cleanser</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">2. Treatment Serum</h3>
                  <p className="text-muted-foreground mb-3">
                    Retinol or niacinamide to target texture, fine lines, and skin renewal.
                  </p>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-foreground mb-1">Recommended:</p>
                    <p className="text-muted-foreground">Paula's Choice 1% Retinol or The Ordinary Niacinamide 10%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Droplet className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">3. Night Cream</h3>
                  <p className="text-muted-foreground mb-3">
                    Richer moisturizer to support overnight skin repair and hydration.
                  </p>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-foreground mb-1">Recommended:</p>
                    <p className="text-muted-foreground">Olay Regenerist Night Recovery or CeraVe Skin Renewing Night Cream</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Tips */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-glow rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Pro Tips for Best Results</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-white">•</span>
                <span>Consistency is key - follow this routine for at least 4-6 weeks to see results</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">•</span>
                <span>Introduce new products one at a time to monitor for reactions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">•</span>
                <span>Take weekly scans to track your progress objectively</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">•</span>
                <span>Stay hydrated and get 7-9 hours of sleep for optimal skin health</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Routine;
