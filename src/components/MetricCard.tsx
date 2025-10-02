import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface MetricCardProps {
  title: string;
  score: number;
  severity: string;
  description: string;
  icon: LucideIcon;
}

export const MetricCard = ({ title, score, severity, description, icon: Icon }: MetricCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";
    return "text-primary";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-success";
    if (score >= 6) return "bg-warning";
    return "bg-primary";
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-glow">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{severity}</p>
          </div>
        </div>
        <div className={cn("text-3xl font-bold", getScoreColor(score))}>
          {score}<span className="text-lg text-muted-foreground">/10</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Quality</span>
          <span>{score * 10}%</span>
        </div>
        <Progress value={score * 10} className="h-2" indicatorClassName={getProgressColor(score)} />
      </div>

      {!expanded && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}

      {expanded && (
        <div className="text-sm text-muted-foreground space-y-2 mb-3 animate-fade-in">
          <p>{description}</p>
          <p className="mt-3 pt-3 border-t border-border">
            {score >= 8 
              ? "Your skin is showing excellent results in this area. Keep up your current routine!"
              : score >= 6
              ? "Good progress! Consider targeted treatments to further improve this metric."
              : "This area could benefit from specialized care. Check our recommendations for targeted products."}
          </p>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {expanded ? "Show Less" : "Learn More"} →
      </button>
    </div>
  );
};
