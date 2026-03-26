"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Note: removed 'useRouter' here as unused, but we'll need it.
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SubscriptionPage() {
  useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    // This would typically involve calling an API endpoint
    // to cancel the subscription via Stripe/Backend logic
    if (confirm("Are you sure you want to cancel your subscription?")) {
      alert("This functionality would cancel your subscription. Mocking cancellation process...");
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        alert("Subscription cancelled (simulated).");
        setLoading(false);
        router.push("/dashboard");
      }, 1000);
    }
  };

  return (
      <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-4xl mx-auto flex flex-col items-center justify-center">
        <div className="flex w-full items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">Manage Subscription</h1>
        </div>

        <Card className="glass-panel border-white/5 w-full max-w-md">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                    <span className="text-green-400 text-sm font-medium uppercase tracking-wider">Active</span>
                </div>
                <CardTitle className="text-2xl">Current Plan</CardTitle>
                <CardDescription>
                    Your membership is active and renews automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div>
                     <p className="text-sm text-muted-foreground mb-1">Billing Cycle</p>
                     <p className="text-white font-medium">Monthly ($19.99/mo)</p>
                 </div>
                 <div>
                     <p className="text-sm text-muted-foreground mb-1">Next Payment</p>
                     <p className="text-white font-medium">April 26, 2026</p>
                 </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                 <Button variant="destructive" className="w-full" onClick={handleCancel} disabled={loading}>
                     {loading ? "Processing..." : "Cancel Subscription"}
                 </Button>
                 <p className="text-xs text-center text-muted-foreground w-full">
                     Need help? <a href="#" className="underline hover:text-white">Contact Support</a>
                 </p>
            </CardFooter>
        </Card>
      </main>
  );
}
