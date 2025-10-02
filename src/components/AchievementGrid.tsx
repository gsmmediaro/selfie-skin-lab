import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AchievementBadge, Achievement } from "./AchievementBadge";
import { Trophy } from "lucide-react";

interface AchievementGridProps {
  achievements: Achievement[];
  className?: string;
}

export const AchievementGrid = ({ achievements, className }: AchievementGridProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Achievements
        </CardTitle>
        <CardDescription>
          {unlockedCount} of {totalCount} unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              size="md"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};