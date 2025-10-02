import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedMetricBarProps {
  score: number;
  label: string;
  color?: "success" | "warning" | "danger" | "primary";
  className?: string;
}

export const AnimatedMetricBar = ({
  score,
  label,
  color = "primary",
  className,
}: AnimatedMetricBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, score]);

  const colorClasses = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    primary: "bg-primary",
  };

  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-bold">{animatedScore}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out rounded-full",
            colorClasses[color]
          )}
          style={{ width: `${animatedScore}%` }}
        />
      </div>
    </div>
  );
};