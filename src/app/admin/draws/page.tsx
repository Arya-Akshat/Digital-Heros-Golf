// src/app/admin/draws/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminDrawsPage() {
  const draws = await prisma.draw.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
        winners: true,
        _count: {
            select: { entries: true }
        }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold text-white">Draw Management</h1>
         {/* Button removed as per earlier instructions, but list should be visible */}
      </div>

      <div className="grid gap-4">
        {draws.length === 0 ? (
            <p className="text-muted-foreground">No draws found.</p>
        ) : (
            draws.map((draw) => (
                <Card key={draw.id} className="glass-panel border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">
                            Draw Date: {new Date(draw.drawDate).toLocaleDateString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>Status: {draw.status}</p>
                        <p>Entries: {draw._count.entries}</p>
                        <p>Jackpot: ${draw.jackpotAmount.toString()}</p>
                        <p>Winning Numbers: {draw.winningNumbers || "Pending"}</p>
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  );
}