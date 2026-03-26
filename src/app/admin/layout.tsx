// src/app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    // In strict mode, maybe verify role against DB, but session check is faster
    // Double check DB
    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { role: true }
    });

    if (user?.role !== "ADMIN") {
        redirect("/dashboard"); // Or 403
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-white/5 bg-black/50 p-6 md:block">
        <div className="mb-8 flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Admin Panel</span>
        </div>
        <nav className="space-y-4">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white">Overview</Button>
          </Link>
          <Link href="/admin/draws">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white">Draws</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start mt-8 border-white/10 text-white/50">Back to App</Button>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
