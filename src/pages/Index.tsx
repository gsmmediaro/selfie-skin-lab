import { Button } from "@/components/ui/button";
import { Camera, TrendingUp, Sparkles, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "AI Skin Scan",
      description: "Advanced facial analysis in seconds using your phone camera",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your skin health journey with detailed metrics over time",
    },
    {
      icon: Sparkles,
      title: "Get Recommendations",
      description: "Personalized skincare routine based on your unique skin analysis",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      score: 87,
      text: "SkinScan helped me identify my skin concerns and my Glow Score improved by 15 points in just 2 months!",
    },
    {
      name: "Jessica L.",
      score: 92,
      text: "I love tracking my progress. The AI analysis is incredibly detailed and the recommendations actually work.",
    },
    {
      name: "Emily R.",
      score: 85,
      text: "Finally, a skincare app that gives me actionable insights. My skin has never looked better!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Personal{" "}
                <span className="bg-gradient-glow bg-clip-text text-transparent">
                  Skin Analysis Lab
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Transform your smartphone into an AI-powered skin health tracker. Get your Glow Score in seconds.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/scan")}
                className="bg-gradient-glow hover:opacity-90 transition-opacity text-lg px-8 shadow-glow"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Your Glow Up
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/progress")}
                className="text-lg px-8"
              >
                View Demo Results
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Scans Done</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">4.8★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">92%</div>
                <div className="text-sm text-muted-foreground">See Results</div>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <img
              src={heroImage}
              alt="Woman with glowing skin taking selfie"
              className="rounded-3xl shadow-glow w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card rounded-2xl p-6 shadow-glow max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-glow flex items-center justify-center text-white font-bold text-xl">
                  87
                </div>
                <div>
                  <div className="font-bold text-foreground">Excellent!</div>
                  <div className="text-sm text-muted-foreground">Your Glow Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Your path to healthier, glowing skin in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-glow flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Real Results, Real People</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands who transformed their skin health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-card rounded-2xl p-8 shadow-card"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-glow flex items-center justify-center text-white font-bold">
                    {testimonial.score}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">Glow Score: {testimonial.score}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-glow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Glow Score?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their skin health with AI-powered insights
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/scan")}
            className="bg-white text-primary hover:bg-white/90 text-lg px-12 shadow-lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Free Scan Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-2">
                SkinScan
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered skin health companion
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
