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
    // Design alb profesional: doar albastru pentru toate scorurile
    return "text-blue-600";
  };

  const getScoreGradient = (score: number) => {
    // Gradient subtil albastru
    return "from-blue-500/10 to-blue-500/5";
  };

  const getStrokeColor = (score: number) => {
    // Albastru profesional consistent
    return "#3b82f6"; // blue-500
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
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle with glow */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getStrokeColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
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
        <div className="text-sm font-medium text-gray-500 mt-1">
          Glow Score
        </div>
      </div>

      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-full blur-3xl transition-opacity duration-500 bg-gradient-to-br",
        getScoreGradient(score),
        animate && isAnimating ? "opacity-40" : "opacity-60"
      )} />
    </div>
  );
};
