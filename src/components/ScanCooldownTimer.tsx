import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Crown } from "lucide-react";
import { differenceInSeconds } from "date-fns";

interface ScanCooldownTimerProps {
  nextAvailableDate: Date;
  onUpgrade: () => void;
  className?: string;
}

export const ScanCooldownTimer = ({
  nextAvailableDate,
  onUpgrade,
  className,
}: ScanCooldownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const secondsLeft = differenceInSeconds(nextAvailableDate, now);

      if (secondsLeft <= 0) {
        setTimeRemaining("Available now!");
        return;
      }

      const days = Math.floor(secondsLeft / 86400);
      const hours = Math.floor((secondsLeft % 86400) / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      let timeStr = "";
      if (days > 0) timeStr += `${days}d `;
      if (hours > 0 || days > 0) timeStr += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeStr += `${minutes}m `;
      timeStr += `${seconds}s`;

      setTimeRemaining(timeStr);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextAvailableDate]);

  return (
    <Card className={className}>
      <div className="p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
          <Clock className="w-10 h-10 text-muted-foreground" />
        </div>

        <div>
          <h3 className="text-2xl font-display font-bold mb-2">
            Free Scan Used
          </h3>
          <p className="text-muted-foreground">
            Your next free scan will be available in:
          </p>
        </div>

        <div className="text-4xl font-display font-bold text-primary">
          {timeRemaining}
        </div>

        <div className="pt-4 space-y-3">
          <Button
            onClick={onUpgrade}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-premium"
            size="lg"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade for Unlimited Scans
          </Button>

          <p className="text-xs text-muted-foreground">
            Premium users get unlimited scans, detailed analysis, and more
          </p>
        </div>
      </div>
    </Card>
  );
};