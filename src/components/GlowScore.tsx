import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export const GlowScore = ({ score, size = "lg", animate = true }: GlowScoreProps) => {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!animate) return;
    
    setIsAnimating(true);
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animate]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-primary";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success/20 to-success/5";
    if (score >= 60) return "from-warning/20 to-warning/5";
    return "from-primary/20 to-primary/5";
  };

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const textSizes = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", getScoreColor(score))}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      
      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn(
          "font-display font-bold tracking-tight transition-all duration-300",
          textSizes[size],
          getScoreColor(score),
          animate && !isAnimating && displayScore === score && "animate-count-up"
        )}>
          {displayScore}
        </div>
        <div className="text-sm font-medium text-muted-foreground mt-1">
          Glow Score
        </div>
      </div>

      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-full blur-2xl transition-opacity duration-500",
        getScoreGradient(score),
        animate && isAnimating ? "opacity-30" : "opacity-50"
      )} />
    </div>
  );
};
