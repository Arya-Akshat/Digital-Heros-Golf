// src/app/pricing/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planName: string) => {
    setLoading(true);
    try {
      const plan = planName.toUpperCase().includes("ANNUAL") ? "ANNUAL" : "MONTHLY";
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) throw new Error("Subscription failed");

      // Success
      alert("Subscription activated successfully!"); // Simple feedback
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Monthly Membership",
      price: "$19.99",
      interval: "/ month",
      description: "Perfect for casual players getting started.",
      features: [
        "1 Entry per month",
        "Track 5 latest scores",
        "Support 1 charity",
        "Standard prize pool access",
        "Cancel anytime"
      ],
      popular: false
    },
    {
      name: "Annual Elite",
      price: "$199.99",
      interval: "/ year",
      description: "Best value for committed golfers.",
      features: [
        "12 Entries per year",
        "Track unlimited history (coming soon)",
        "Support multiple charities",
        "VIP prize pool access",
        "Priority winner verification",
        "2 Months free"
      ],
      popular: true
    }
  ];

  return (
    <main className="min-h-screen py-24 px-4 bg-background relative overflow-hidden">
       {/* Background */}
       <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

       <div className="max-w-7xl mx-auto space-y-16 relative z-10">
         <div className="text-center space-y-4">
           <h1 className="text-5xl font-bold tracking-tight text-white">Choose Your Impact</h1>
           <p className="text-xl text-blue-100/60 max-w-2xl mx-auto">
             Join the club that rewards your game and changes the world.
           </p>
         </div>

         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {plans.map((plan) => (
             <Card 
               key={plan.name} 
               className={`glass-card relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${plan.popular ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : ''}`}
             >
               {plan.popular && (
                 <div className="absolute top-0 right-0 px-4 py-1 bg-cyan-500 text-blue-950 font-bold text-xs rounded-bl-xl">
                   MOST POPULAR
                 </div>
               )}
               <CardHeader>
                 <CardTitle className="text-2xl">{plan.name}</CardTitle>
                 <CardDescription>{plan.description}</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="flex items-baseline">
                   <span className="text-4xl font-bold text-white">{plan.price}</span>
                   <span className="text-muted-foreground ml-2">{plan.interval}</span>
                 </div>
                 <ul className="space-y-3">
                   {plan.features.map((feature) => (
                     <li key={feature} className="flex items-center gap-3 text-sm text-blue-100/80">
                       <Check size={18} className="text-cyan-400 shrink-0" />
                       {feature}
                     </li>
                   ))}
                 </ul>
               </CardContent>
               <CardFooter>
                 <Button 
                   className="w-full" 
                   variant={plan.popular ? "premium" : "outline"}
                   size="lg"
                   onClick={() => handleSubscribe(plan.name)}
                   disabled={loading}
                 >
                   {loading ? "Processing..." : "Subscribe Now"}
                 </Button>
               </CardFooter>
             </Card>
           ))}
         </div>

         <div className="text-center text-sm text-muted-foreground mt-8">
            <p>Secure payment processing via Stripe. 100% money-back guarantee for 30 days.</p>
         </div>
       </div>
    </main>
  );
}
