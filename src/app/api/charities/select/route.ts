// src/app/api/charities/select/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { charityId, contributionPercent } = await req.json();
    
    // Validation
    if (!charityId) {
        return NextResponse.json({ error: "Charity ID is required" }, { status: 400 });
    }

    let percent = parseInt(contributionPercent);
    if (isNaN(percent) || percent < 10 || percent > 100) {
        return NextResponse.json({ error: "Contribution must be between 10% and 100%" }, { status: 400 });
    }

    // Check if charity exists
    const charity = await prisma.charity.findUnique({
        where: { id: charityId }
    });

    if (!charity) {
        return NextResponse.json({ error: "Charity not found" }, { status: 404 });
    }

    // Upsert selection
    const selection = await prisma.userCharitySelection.upsert({
        where: { userId: session.user.id },
        update: {
            charityId,
            contributionPercent: percent
        },
        create: {
            userId: session.user.id,
            charityId,
            contributionPercent: percent
        }
    });

    return NextResponse.json(selection);
  } catch (error) {
    console.error("Error selecting charity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
