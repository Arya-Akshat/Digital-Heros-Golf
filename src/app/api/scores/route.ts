// src/app/api/scores/route.ts
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
    const body = await req.json();
    const score = parseInt(body.score);
    const date = body.date ? new Date(body.date) : new Date();

    if (isNaN(score) || score < 1 || score > 45) {
      return NextResponse.json(
        { error: "Invalid score. Must be between 1 and 45 (Stableford)." },
        { status: 400 }
      );
    }

    // Use a transaction to ensure we maintain only the latest 5 scores
    const result = await prisma.$transaction(async (tx) => {
      // 1. Add the new score
      const newScore = await tx.golfScore.create({
        data: {
          userId: session.user.id,
          score,
          date,
        },
      });

      // 2. Count current scores
      const count = await tx.golfScore.count({
        where: { userId: session.user.id },
      });

      // 3. If more than 5, delete the oldest ones
      if (count > 5) {
        const excess = count - 5;
        const oldestScores = await tx.golfScore.findMany({
          where: { userId: session.user.id },
          orderBy: [{ date: "asc" }, { createdAt: "asc" }],
          take: excess,
          select: { id: true },
        });

        if (oldestScores.length > 0) {
          await tx.golfScore.deleteMany({
            where: {
              id: { in: oldestScores.map((s) => s.id) },
            },
          });
        }
      }

      return newScore;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scores = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
          scores: {
              orderBy: { date: 'desc' },
              take: 5
          }
      }
  });

  return NextResponse.json(scores?.scores || []);
}
