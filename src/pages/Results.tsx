import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowScore } from "@/components/GlowScore";
import { ShareModal } from "@/components/ShareModal";
import { CheckCircle, Target, Lock, Sparkles } from "lucide-react";
import { getScanById, unlockScan } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { toast } from "sonner";

const Results = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<SkinAnalysis | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

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

    setScan(scanData);
  }, [scanId, navigate]);

  const handleUnlock = () => {
    if (!scanId) return;
    unlockScan(scanId);
    const updatedScan = getScanById(scanId);
    if (updatedScan) {
      setScan(updatedScan);
      navigate(`/analysis/${scanId}`);
    }
  };

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-glow-pulse">Loading...</div>
      </div>
    );
  }

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
          <div className="text-sm text-muted-foreground">
            Step 2 of 3: Results
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Glow Score */}
          <div className="text-center space-y-8 animate-scale-in">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Glow Score</h1>
              <p className="text-muted-foreground">
                {scan.glowScore >= 80
                  ? "Excellent! Your skin is in great shape!"
                  : scan.glowScore >= 60
                  ? "Good work! There's room for improvement."
                  : "Let's work together to improve your skin health."}
              </p>
            </div>

            <div className="flex justify-center">
              <GlowScore score={scan.glowScore} />
            </div>
          </div>

          {/* Quick Insights */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Strength */}
            <div className="bg-success/10 border-2 border-success/20 rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-success/20">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Your Strength</h3>
              </div>
              <p className="text-2xl font-bold text-success mb-2">{scan.strength}</p>
              <p className="text-sm text-muted-foreground">
                This is where your skin really shines! Keep doing what you're doing.
              </p>
            </div>

            {/* Focus Area */}
            <div className="bg-warning/10 border-2 border-warning/20 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-warning/20">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Focus Area</h3>
              </div>
              <p className="text-2xl font-bold text-warning mb-2">{scan.focusArea}</p>
              <p className="text-sm text-muted-foreground">
                A little extra attention here will make a big difference in your overall score.
              </p>
            </div>
          </div>

          {/* Unlock CTA */}
          <div className="bg-gradient-card rounded-3xl p-8 shadow-glow border-2 border-primary/20 text-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-glow mb-2">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-3">Unlock Your Complete Analysis</h2>
              <p className="text-muted-foreground text-lg mb-2">
                Get access to:
              </p>
              <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  Detailed breakdown of all 5 skin metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  Visual heat map of problem areas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  Personalized AM/PM skincare routine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  Product recommendations for your skin
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-glow hover:opacity-90 transition-opacity text-lg px-12 shadow-glow"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Unlock Full Report
            </Button>

            <p className="text-sm text-muted-foreground">
              Share your Glow Score to unlock instantly, or upgrade to Premium
            </p>
          </div>

          {/* Sample Preview */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
            <div className="blur-sm opacity-50 pointer-events-none space-y-4 p-6 bg-card rounded-2xl border">
              <div className="h-32 bg-gradient-card rounded-xl" />
              <div className="h-24 bg-gradient-card rounded-xl" />
              <div className="h-24 bg-gradient-card rounded-xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-background/95 rounded-2xl p-6 shadow-glow border">
                <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="font-semibold text-foreground">Unlock to view detailed analysis</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        onUnlock={handleUnlock}
        glowScore={scan.glowScore}
      />
    </div>
  );
};

export default Results;
