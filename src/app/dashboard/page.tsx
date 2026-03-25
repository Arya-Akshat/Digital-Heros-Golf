// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy, Target, Gift, Heart, User } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch all user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      scores: {
        orderBy: { date: 'desc' },
        take: 5
      },
      charitySelect: {
        include: { charity: true }
      },
      winnings: true
    }
  });

  if (!user) {
      redirect("/login"); // Should not happen
  }

  const scores = user.scores || [];
  const subscription = user.subscription;
  const charity = user.charitySelect?.charity;

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
           <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        
        {!subscription || subscription.status !== 'ACTIVE' ? (
             <Link href="/pricing" className="inline-block">
                 <Button variant="premium" className="animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    Activate Subscription
                 </Button>
             </Link>
        ) : (
            <div className="px-4 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-800 text-sm font-medium">
                Active Member
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Score</CardTitle>
            <Target className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{scores[0]?.score || "-"}</div>
            <p className="text-xs text-muted-foreground mb-4">
                {scores[0] ? new Date(scores[0].date).toLocaleDateString() : "No scores yet"}
            </p>
            <Link href="/dashboard/scores">
                <Button size="sm" variant="outline" className="w-full text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    Add Score
                </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Charity</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white truncate">{charity?.name || "Select Charity"}</div>
             <p className="text-xs text-muted-foreground mb-4">
                {user.charitySelect ? `${user.charitySelect.contributionPercent}% contribution` : "Please select a charity"}
            </p>
            {!charity && (
                <Link href="/charities">
                    <Button size="sm" variant="outline" className="w-full text-xs border-pink-500/30 text-pink-400 hover:bg-pink-500/10">
                        Choose Cause
                    </Button>
                </Link>
            )}
          </CardContent>
        </Card>

         <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Draw</CardTitle>
            <Gift className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">In 5 Days</div>
            <p className="text-xs text-muted-foreground">
               Jackpot: $5,000.00
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Winnings</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$0.00</div>
            <p className="text-xs text-muted-foreground">
               Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>

       {/* Main Content Sections */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Scores List */}
           <Card className="col-span-1 lg:col-span-2 glass-panel border-white/5">
                <CardHeader>
                    <CardTitle>Recent Scores</CardTitle>
                    <CardDescription>Your last 5 submitted stableford scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    {scores.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No scores submitted yet.
                            <div className="mt-4">
                                <Link href="/dashboard/scores">
                                    <Button variant="outline">Enter Score</Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {scores.map((score) => (
                                <div key={score.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div>
                                        <div className="font-bold text-white text-lg">{score.score} pts</div>
                                        <div className="text-sm text-muted-foreground">{new Date(score.date).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-xs text-cyan-400 font-medium px-2 py-1 rounded bg-cyan-950/30 border border-cyan-900/50">
                                        Verified
                                    </div>
                                </div>
                            ))}
                             <Link href="/dashboard/history">
                                 <Button className="w-full mt-4" variant="outline">View All History</Button>
                             </Link>
                        </div>
                    )}
                </CardContent>
           </Card>

           {/* Quick Actions / Status */}
           <div className="space-y-6">
                <Card className="glass-panel border-white/5">
                     <CardHeader>
                         <CardTitle>My Subscription</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="text-white font-medium">{subscription?.plan || "None"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <span className={cn("font-medium", subscription?.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400')}>
                                {subscription?.status || "Inactive"}
                            </span>
                        </div>
                        <Link href="/dashboard/subscription">
                            <Button className="w-full" variant="secondary">Manage Subscription</Button>
                        </Link>
                     </CardContent>
                </Card>

                 <Card className="glass-panel border-white/5">
                     <CardHeader>
                         <CardTitle>Charity Impact</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="flex items-center gap-4 mb-4">
                             <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                 <Heart className="h-5 w-5 text-pink-500" />
                             </div>
                             <div>
                                 <div className="font-medium text-white">{charity?.name || "No Charity Selected"}</div>
                                 <div className="text-xs text-muted-foreground">Your chosen cause</div>
                             </div>
                         </div>
                         <Button className="w-full" variant="outline">Change Charity</Button>
                     </CardContent>
                </Card>
           </div>
       </div>
    </main>
  );
}
