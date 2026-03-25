// src/app/dashboard/scores/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EnterScorePage() {
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, date }),
      });

      if (!res.ok) throw new Error("Failed");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-black/95 min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass-panel">
        <CardHeader>
          <CardTitle className="text-white">Enter Score</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Stableford Score (1-45)</label>
              <Input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="1"
                max="45"
                required
                className="bg-black/20 border-white/5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-black/20 border-white/5"
              />
            </div>
            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="premium" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Score"}
                </Button>
                <Link href="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                        Cancel
                    </Button>
                </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}