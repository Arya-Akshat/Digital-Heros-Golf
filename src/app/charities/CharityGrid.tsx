"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface Charity {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
}

export default function CharityGrid({ charities }: { charities: Charity[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSelect = async (charityId: string) => {
    setLoadingId(charityId);
    try {
      const res = await fetch("/api/charities/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ charityId, contributionPercent: 100 }), // Default to 100%
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to select charity");
      }

      alert("Charity selected successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error selecting charity. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {charities.length === 0 ? (
        <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-muted-foreground">No charities available yet.</p>
        </div>
      ) : (
        charities.map((charity) => (
          <Card key={charity.id} className="glass-card hover:scale-[1.02] transition-transform duration-300 flex flex-col">
            <div className="h-48 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 flex items-center justify-center text-white/10">
                <Heart size={64} />
              </div>
            </div>
            <CardHeader>
              <CardTitle>{charity.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {charity.description || "No description available."}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleSelect(charity.id)}
                disabled={loadingId === charity.id}
              >
                {loadingId === charity.id ? "Selecting..." : "Select This Charity"}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
