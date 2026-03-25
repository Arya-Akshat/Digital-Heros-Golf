// src/app/charities/page.tsx
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import CharityGrid from "./CharityGrid";

export default async function CharitiesPage() {
  const charities = await prisma.charity.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  });

  const formattedCharities = charities.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description || null,
    logo: c.logo || null
  }));

  return (
    <main className="min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Our Charity Partners
        </h1>
        <p className="text-xl text-blue-100/60 max-w-2xl mx-auto">
          Choose a cause that matters to you. Your subscription directly supports these organizations.
        </p>
      </div>

      <CharityGrid charities={formattedCharities} />
    </main>
  );
}
