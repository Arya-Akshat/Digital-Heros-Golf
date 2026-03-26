// src/app/api/admin/charities/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Authorization check
  if (!session?.user || session.user.role !== "ADMIN") {
      // Double check from DB just to be safe
      const user = await prisma.user.findUnique({ where: { id: session?.user?.id }});
      if (user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, description, websiteUrl } = await req.json();

    if (!name || !description) {
        return NextResponse.json({ error: "Name and description required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const charity = await prisma.charity.create({
        data: {
            name,
            description,
            websiteUrl,
            slug,
            active: true
        }
    });

    return NextResponse.json(charity);
  } catch (error) {
    console.error("Error creating charity:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
    // Admin list might include inactive ones?
    // For now, simple list
    const charities = await prisma.charity.findMany({
        orderBy: { name: 'asc' }
    });
    return NextResponse.json(charities);
}
