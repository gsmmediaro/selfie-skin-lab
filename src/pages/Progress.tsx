import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, TrendingUp, Calendar } from "lucide-react";
import { getScanHistory } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Progress = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<SkinAnalysis[]>([]);

  useEffect(() => {
    const history = getScanHistory();
    setScans(history);
  }, []);

  const chartData = scans
    .slice()
    .reverse()
    .map((scan) => ({
      date: new Date(scan.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: scan.glowScore,
    }));

  const latestScore = scans[0]?.glowScore || 0;
  const previousScore = scans[1]?.glowScore || 0;
  const improvement = latestScore - previousScore;
  const scanStreak = scans.length;

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
          <Button onClick={() => navigate("/scan")} className="bg-gradient-glow">
            <Camera className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Stats Overview */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="bg-gradient-card rounded-2xl p-6 shadow-card text-center">
            <div className="text-4xl font-bold text-primary mb-2">{latestScore}</div>
            <div className="text-sm text-muted-foreground">Current Glow Score</div>
            {improvement !== 0 && (
              <div className={`text-sm font-medium mt-2 ${improvement > 0 ? "text-success" : "text-warning"}`}>
                {improvement > 0 ? "↑" : "↓"} {Math.abs(improvement)} from last scan
              </div>
            )}
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 shadow-card text-center">
            <div className="text-4xl font-bold text-secondary mb-2">{scanStreak}</div>
            <div className="text-sm text-muted-foreground">Total Scans</div>
            {scanStreak >= 7 && (
              <div className="text-sm font-medium mt-2 text-warning">
                🔥 {scanStreak}-scan streak!
              </div>
            )}
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 shadow-card text-center">
            <div className="text-4xl font-bold text-success mb-2">
              {scans.length > 1 ? Math.round(((latestScore - scans[scans.length - 1].glowScore) / scans[scans.length - 1].glowScore) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Improvement</div>
            <div className="text-xs text-muted-foreground mt-1">Since first scan</div>
          </div>
        </section>

        {/* Timeline Chart */}
        {scans.length > 1 && (
          <section className="bg-white dark:bg-card rounded-3xl p-8 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Glow Score Timeline
              </h2>
              <div className="text-sm text-muted-foreground">Last {scans.length} scans</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* Scan History Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Scan History
            </h2>
          </div>

          {scans.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-dashed">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No scans yet</h3>
              <p className="text-muted-foreground mb-6">
                Take your first scan to start tracking your skin health journey
              </p>
              <Button onClick={() => navigate("/scan")} className="bg-gradient-glow">
                <Camera className="mr-2 h-4 w-4" />
                Take First Scan
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => navigate(scan.unlocked ? `/analysis/${scan.id}` : `/results/${scan.id}`)}
                  className="bg-gradient-card rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer group"
                >
                  {scan.imageData && (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={scan.imageData}
                        alt="Scan"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                          {scan.glowScore}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-muted-foreground">
                        {new Date(scan.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      {!scan.unlocked && (
                        <div className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full font-medium">
                          Locked
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-muted-foreground text-sm">Glow Score</div>
                        <div className="text-2xl font-bold text-foreground">{scan.glowScore}</div>
                      </div>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Weekly Scan Reminder */}
        {scans.length > 0 && (
          <section className="bg-gradient-glow rounded-3xl p-8 text-center shadow-glow">
            <h2 className="text-2xl font-bold text-white mb-4">Keep Your Progress Going!</h2>
            <p className="text-white/90 mb-6">
              Take weekly scans to track your improvement and see how your routine is working
            </p>
            <Button
              onClick={() => navigate("/scan")}
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Weekly Scan
            </Button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Progress;
