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

    const userId = session.user.id;

    // Cancel the subscription by setting status to INACTIVE
    const subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        status: "INACTIVE",
        cancelAtPeriodEnd: true,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
