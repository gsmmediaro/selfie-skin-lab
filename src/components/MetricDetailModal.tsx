import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MetricDetailModalProps {
  open: boolean;
  onClose: () => void;
  metric: {
    name: string;
    score: number;
    severity: string;
    description: string;
  };
  imageData?: string;
}

export const MetricDetailModal = ({ open, onClose, metric, imageData }: MetricDetailModalProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 86) return "text-success";
    if (score >= 71) return "text-[hsl(180,60%,45%)]"; // teal
    if (score >= 56) return "text-warning";
    return "text-danger";
  };

  const getProgressColor = (score: number) => {
    if (score >= 86) return "bg-success";
    if (score >= 71) return "bg-[hsl(180,60%,45%)]";
    if (score >= 56) return "bg-warning";
    return "bg-danger";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>{metric.name}</span>
            <span className={`text-3xl font-bold ${getScoreColor(metric.score)}`}>
              {metric.score}/100
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Score</span>
              <span className="text-sm text-muted-foreground">{metric.severity}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${getProgressColor(metric.score)}`}
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">What This Measures</h4>
            <p className="text-muted-foreground">{metric.description}</p>
          </div>

          {/* Visual */}
          {imageData && (
            <div>
              <h4 className="font-semibold mb-2">Your Photo</h4>
              <div className="relative rounded-xl overflow-hidden bg-black">
                <img src={imageData} alt="Analysis" className="w-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              </div>
            </div>
          )}

          {/* Related Factors */}
          <div>
            <h4 className="font-semibold mb-2">Often Affected By</h4>
            <div className="flex flex-wrap gap-2">
              {["Diet", "Stress", "Sleep", "Skincare Routine"].map((factor) => (
                <span
                  key={factor}
                  className="px-3 py-1 bg-accent rounded-full text-sm"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button className="w-full bg-success hover:bg-success/90 text-white">
            Get Personalized Routine for {metric.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
