import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AWARD-ACHIEVEMENT] ${step}${detailsStr}`);
};

interface AchievementRequest {
  achievementType: string;
  achievementName: string;
  achievementDescription: string;
}

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
    const body: AchievementRequest = await req.json();
    
    logStep("Award request", { userId, type: body.achievementType });

    // Check if achievement already exists
    const { data: existing, error: checkError } = await supabaseClient
      .from("achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_type", body.achievementType)
      .eq("achievement_name", body.achievementName)
      .single();

    if (existing) {
      logStep("Achievement already unlocked", { achievementId: existing.id });
      return new Response(
        JSON.stringify({
          success: false,
          message: "Achievement already unlocked",
          alreadyUnlocked: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Insert new achievement
    const { data: achievement, error: insertError } = await supabaseClient
      .from("achievements")
      .insert({
        user_id: userId,
        achievement_type: body.achievementType,
        achievement_name: body.achievementName,
        achievement_description: body.achievementDescription,
        progress: 100,
      })
      .select()
      .single();

    if (insertError) {
      logStep("Error inserting achievement", { error: insertError });
      throw new Error("Failed to award achievement");
    }

    logStep("Achievement awarded", { achievementId: achievement.id });

    // Update user stats total achievements count
    const { error: updateError } = await supabaseClient.rpc(
      "increment_total_achievements",
      { user_id: userId }
    );

    if (updateError) {
      logStep("Warning: Could not update achievement count", { error: updateError });
      // Don't fail the request, achievement is already awarded
    }

    return new Response(
      JSON.stringify({
        success: true,
        achievement,
        message: `Achievement unlocked: ${body.achievementName}`,
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