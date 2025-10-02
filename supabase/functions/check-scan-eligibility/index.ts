import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-ELIGIBILITY] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const userId = userData.user.id;
    logStep("User authenticated", { userId });

    // Get user stats
    const { data: stats, error: statsError } = await supabaseClient
      .from("user_stats")
      .select("last_free_scan_date, free_scans_remaining")
      .eq("user_id", userId)
      .single();

    if (statsError) {
      logStep("Error fetching stats", { error: statsError });
      throw new Error("Failed to fetch user stats");
    }

    // Check if user is premium
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("subscription_tier")
      .eq("id", userId)
      .single();

    if (profileError) {
      logStep("Error fetching profile", { error: profileError });
      throw new Error("Failed to fetch user profile");
    }

    const isPremium = profile?.subscription_tier === "premium";
    logStep("Checked premium status", { isPremium });

    // Premium users can always scan
    if (isPremium) {
      return new Response(
        JSON.stringify({
          eligible: true,
          isPremium: true,
          reason: "Premium user - unlimited scans",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Free users: check 7-day cooldown
    if (!stats?.last_free_scan_date) {
      // First scan ever - eligible
      logStep("First scan - eligible");
      return new Response(
        JSON.stringify({
          eligible: true,
          isPremium: false,
          reason: "First free scan",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const lastScanDate = new Date(stats.last_free_scan_date);
    const now = new Date();
    const daysSinceLastScan = (now.getTime() - lastScanDate.getTime()) / (1000 * 60 * 60 * 24);

    logStep("Checked cooldown", { daysSinceLastScan });

    if (daysSinceLastScan >= 7) {
      // Cooldown expired - eligible
      return new Response(
        JSON.stringify({
          eligible: true,
          isPremium: false,
          reason: "Cooldown expired",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Still in cooldown
    const nextAvailableDate = new Date(lastScanDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const hoursRemaining = Math.ceil((nextAvailableDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    return new Response(
      JSON.stringify({
        eligible: false,
        isPremium: false,
        reason: "Cooldown active",
        nextAvailableDate: nextAvailableDate.toISOString(),
        hoursRemaining,
        daysRemaining: Math.ceil(hoursRemaining / 24),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});