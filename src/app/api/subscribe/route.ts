import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!["MONTHLY", "ANNUAL"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const userId = session.user.id;

    // Simulate mock subscription creation 
    // Usually this would go through a payment gateway webhook
    const subscription = await prisma.subscription.upsert({
      where: {
        userId: userId,
      },
      update: {
        plan: plan,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        // 1 month or 1 year from now
        currentPeriodEnd: new Date(Date.now() + (plan === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      },
      create: {
        userId: userId,
        plan: plan,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
