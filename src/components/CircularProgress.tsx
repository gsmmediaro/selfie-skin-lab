import { TrendingUp, TrendingDown } from "lucide-react";

interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  delta?: number;
  subtext?: string;
}

export const CircularProgress = ({ 
  score, 
  size = 200, 
  strokeWidth = 12,
  delta,
  subtext
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    // Design alb profesional: doar albastru
    return "#3b82f6"; // blue-500
  };

  const getTextColor = (score: number) => {
    // Albastru profesional pentru toate scorurile
    return "text-blue-600";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <filter id="glow-progress">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle with glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#glow-progress)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${getTextColor(score)} animate-count-up`}>
            {score}
          </div>
          <div className="text-sm text-gray-500 mt-1">Glow Score</div>
        </div>
      </div>

      {/* Delta and subtext */}
      {delta !== undefined && delta !== 0 && (
        <div className={`flex items-center gap-1 mt-4 ${delta > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
          {delta > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-semibold">{delta > 0 ? '+' : ''}{delta} from last scan</span>
        </div>
      )}

      {subtext && (
        <div className="text-sm text-gray-500 mt-2">{subtext}</div>
      )}
    </div>
  );
};
