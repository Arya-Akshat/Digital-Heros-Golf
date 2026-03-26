// src/lib/draw-service.ts
import { prisma } from "@/lib/prisma";

export class DrawService {
  /**
   * Generates random winning numbers for a draw
   * Rule: 5 numbers between 1 and 45 (Stableford range)
   */
  static generateWinningNumbers(): number[] {
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const arr = Array.from(numbers).sort((a, b) => a - b);
    return arr;
  }

  static calculateMatch(scores: number[], winningNumbers: number[]): number {
    const uniqueScores = new Set(scores);
    let matchCount = 0;

    uniqueScores.forEach((score) => {
      if (winningNumbers.includes(score)) {
        matchCount++;
      }
    });

    return matchCount;
  }

  /**
   * Executes a draw for the given date
   * 1. Generates winning numbers
   * 2. Snapshots user scores that match the criteria
   * 3. Determines winners based on matches (3, 4, or 5)
   */
  static async runDraw(jackpotAmount = 5000) {
    const winningNumbers = this.generateWinningNumbers();
    const winningNumbersString = winningNumbers.join(",");

    // Create the Draw record
    const draw = await prisma.draw.create({
      data: {
        drawDate: new Date(),
        status: "COMPLETED",
        winningNumbers: winningNumbersString,
        jackpotAmount: jackpotAmount,
        totalPrizePool: jackpotAmount, // Simplified for MVP
      },
    });

    console.log(`Draw Created: ${draw.id} with numbers: ${winningNumbersString}`);

    // Get all active users with at least one score
    // In a real app, you'd filter by subscription status too
    const users = await prisma.user.findMany({
      include: {
        scores: {
          orderBy: { date: 'desc' },
          take: 5, // Only consider latest 5 scores
        },
        subscription: true
      },
      where: {
        subscription: {
          status: "ACTIVE"
        }
      }
    });

    for (const user of users) {
        if (!user.scores || user.scores.length === 0) continue;

        const userScores = user.scores.map((score) => score.score);
        const matchCount = this.calculateMatch(userScores, winningNumbers);

        // Determine Win Tier
        let prize = 0;
        if (matchCount === 5) prize = Number(jackpotAmount) * 0.40;
        else if (matchCount === 4) prize = Number(jackpotAmount) * 0.35;
        else if (matchCount === 3) prize = Number(jackpotAmount) * 0.25;

        // Create Winner Record if applicable
        if (prize > 0) {
            await prisma.winner.create({
              data: {
                drawId: draw.id,
                userId: user.id,
                matchCount: matchCount,
                prizeAmount: prize,
                status: "PENDING_PROOF",
              },
            });
        }

       // Record entry (snapshot)
       await prisma.drawEntry.create({
        data: {
            drawId: draw.id,
            userId: user.id,
            scoreSnapshot: user.scores[0]?.score || 0 
        }
     });
    }

    return draw;
  }

  /**
   * Runs a simulation for a given draw.
   */
  static async simulateDraw() {
    // 1. Fetch eligible users (active sub + >= 5 scores)
    // Actually policy is "latest 5 scores". If user has < 5, maybe ineligible?
    // Assume minimum 5 scores required.
    
    // Fetch users with active subscription and include their latest 5 scores
    const eligibleUsers = await prisma.user.findMany({
        where: {
            subscription: { status: 'ACTIVE' },
            scores: { some: {} } // Has at least one score
        },
        include: {
            scores: {
                orderBy: { date: 'desc' },
                take: 5
            }
        }
    });

    const validEntries = eligibleUsers.filter(u => u.scores.length === 5);
    
    // 2. Generate Draw Numbers
    const numbers = this.generateWinningNumbers();

    // 3. Calculate Winners
    let tier5 = 0;
    let tier4 = 0;
    let tier3 = 0;

    for (const user of validEntries) {
        const scores = user.scores.map((score) => score.score);
        const matches = this.calculateMatch(scores, numbers);

        if (matches === 5) tier5++;
        else if (matches === 4) tier4++;
        else if (matches === 3) tier3++;
    }

    return {
        numbers,
        stats: {
            totalEntries: validEntries.length,
            tier5,
            tier4,
            tier3
        }
    };
  }
}
