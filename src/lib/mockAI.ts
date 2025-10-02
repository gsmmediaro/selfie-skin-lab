export interface SkinAnalysis {
  id: string;
  timestamp: number;
  glowScore: number;
  imageData?: string;
  metrics: {
    acne: { score: number; severity: string; description: string };
    redness: { score: number; severity: string; description: string };
    texture: { score: number; severity: string; description: string };
    fineLines: { score: number; severity: string; description: string };
    darkSpots: { score: number; severity: string; description: string };
  };
  strength: string;
  focusArea: string;
  unlocked: boolean;
}

// Mock AI analysis with realistic but randomized data
export const analyzeSkin = async (imageData: string): Promise<SkinAnalysis> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Generate realistic scores (weighted towards better skin)
  const generateScore = () => Math.floor(Math.random() * 3) + 7; // 7-10 range
  
  const acneScore = generateScore();
  const rednessScore = generateScore();
  const textureScore = generateScore();
  const fineLinesScore = generateScore();
  const darkSpotsScore = generateScore();

  // Calculate overall glow score (weighted average)
  const glowScore = Math.round(
    (acneScore * 0.25 + rednessScore * 0.2 + textureScore * 0.25 + fineLinesScore * 0.15 + darkSpotsScore * 0.15) * 10
  );

  // Determine severity levels
  const getSeverity = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Needs Attention";
  };

  // Find strength and focus area
  const scores = [
    { name: "Clear Complexion", score: acneScore },
    { name: "Even Tone", score: rednessScore },
    { name: "Smooth Texture", score: textureScore },
    { name: "Youthful Appearance", score: fineLinesScore },
    { name: "Radiant Brightness", score: darkSpotsScore },
  ];
  
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const strength = sorted[0].name;
  const focusArea = sorted[sorted.length - 1].name;

  return {
    id: `scan_${Date.now()}`,
    timestamp: Date.now(),
    glowScore,
    imageData,
    metrics: {
      acne: {
        score: acneScore,
        severity: getSeverity(acneScore),
        description: "Analysis of breakouts, blemishes, and acne-prone areas",
      },
      redness: {
        score: rednessScore,
        severity: getSeverity(rednessScore),
        description: "Assessment of skin redness and inflammation",
      },
      texture: {
        score: textureScore,
        severity: getSeverity(textureScore),
        description: "Evaluation of skin smoothness and pore visibility",
      },
      fineLines: {
        score: fineLinesScore,
        severity: getSeverity(fineLinesScore),
        description: "Detection of fine lines and wrinkles",
      },
      darkSpots: {
        score: darkSpotsScore,
        severity: getSeverity(darkSpotsScore),
        description: "Identification of hyperpigmentation and dark spots",
      },
    },
    strength,
    focusArea,
    unlocked: false,
  };
};
