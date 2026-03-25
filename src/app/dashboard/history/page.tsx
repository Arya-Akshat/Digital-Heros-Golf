import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const scores = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      scores: {
        orderBy: { date: 'desc' }
      }
    }
  });

  const allScores = scores?.scores || [];

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">Score History</h1>
      </div>

      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle>All Submitted Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {allScores.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No scores found.
              <div className="mt-4">
                <Link href="/dashboard/scores">
                  <Button variant="outline">Enter First Score</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {allScores.map((score) => (
                <div key={score.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <div className="font-bold text-white text-lg">{score.score} pts</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(score.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-cyan-400 font-medium px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-900/50">
                    Verified
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
