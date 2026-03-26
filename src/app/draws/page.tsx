import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DrawsPage() {
  const draws = await prisma.draw.findMany({
    where: {
      status: {
        in: ["COMPLETED", "SCHEDULED"] // Only show completed or scheduled draws
      }
    },
    orderBy: { drawDate: 'desc' },
    include: {
      winners: {
         include: {
             user: {
                 select: { name: true } // Only show winner names
             }
         }
      }
    }
  });

  const nextDraw = draws.find(d => d.status === "SCHEDULED");
  const pastDraws = draws.filter(d => d.status === "COMPLETED");

  return (
    <main className="min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Section / Next Draw */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Monthly Prize Draws
        </h1>
        <p className="text-xl text-blue-100/60 max-w-2xl mx-auto">
          Every month, lucky members win exclusive prizes just for playing the game they love.
        </p>

        {nextDraw ? (
            <div className="relative mt-12 p-8 max-w-3xl mx-auto rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={120} className="text-cyan-400" />
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
                        <Calendar size={14} />
                        Next Draw: {new Date(nextDraw.drawDate).toLocaleDateString()}
                    </div>
                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                        ${nextDraw.jackpotAmount.toString()}
                    </h2>
                    <p className="text-lg text-blue-100/80">Estimated Jackpot</p>
                    <div className="pt-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-blue-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                Enter Now via Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        ) : (
            <div className="mt-12 p-8 rounded-2xl glass-panel border-white/5">
                <p className="text-muted-foreground">Next draw date coming soon!</p>
            </div>
        )}
      </section>

      {/* Past Draws Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Previous Winners
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastDraws.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-white/5 rounded-xl border border-white/5">
                    No past draws to display yet.
                </div>
            ) : (
                pastDraws.map((draw) => (
                    <Card key={draw.id} className="glass-card hover:border-cyan-500/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-lg">
                                <span>{new Date(draw.drawDate).toLocaleDateString()}</span>
                                <span className="text-sm font-normal px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-800/50">
                                    Completed
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Jackpot</p>
                                <p className="text-xl font-bold text-white">${draw.jackpotAmount.toString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Winner</p>
                                {draw.winners && draw.winners.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
                                            {draw.winners[0].user.name?.[0] || "U"}
                                        </div>
                                        <span className="text-white font-medium">{draw.winners[0].user.name || "Anonymous User"}</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/50 italic">Winner announcement pending</p>
                                )}
                            </div>
                            {draw.winningNumbers && (
                                <div>
                                     <p className="text-sm text-muted-foreground mb-1">Winning Numbers</p>
                                     <div className="font-mono text-cyan-400 tracking-wider">
                                        {draw.winningNumbers}
                                     </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
      </section>
    </main>
  );
}
