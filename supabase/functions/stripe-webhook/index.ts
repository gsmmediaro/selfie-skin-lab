import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@18.5.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    const event = webhookSecret
      ? stripe.webhooks.constructEvent(body, signature, webhookSecret)
      : JSON.parse(body);

    console.log("Webhook event:", event.type);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Update user profile with stripe info
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_tier: "premium",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq("email", session.customer_email);

        if (error) {
          console.error("Error updating profile:", error);
        } else {
          console.log("User upgraded to premium:", session.customer_email);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Downgrade user to free tier
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", subscription.customer);

        if (error) {
          console.error("Error downgrading user:", error);
        } else {
          console.log("User downgraded to free");
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status;

        // Update subscription status
        const tier = status === "active" ? "premium" : "free";
        
        const { error } = await supabase
          .from("profiles")
          .update({ subscription_tier: tier })
          .eq("stripe_customer_id", subscription.customer);

        if (error) {
          console.error("Error updating subscription:", error);
        } else {
          console.log("Subscription updated:", subscription.customer, tier);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});