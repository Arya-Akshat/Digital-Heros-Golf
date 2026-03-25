// src/lib/draw-service.ts
import { prisma } from "@/lib/prisma";

export interface DrawResult {
  numbers: number[];
  winners: {
    tier5: number;
    tier4: number;
    tier3: number;
  };
  totalPrizePool: number;
  jackpot: number;
}

export class DrawService {
  /**
   * Generates 5 unique random numbers between 1 and 45.
   */
  static generateNumbers(): number[] {
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  /**
   * Calculates matches between user scores and draw numbers.
   * Assumes strict set matching for now (all unique).
   * If a user has duplicate scores {36, 36, ...}, and draw has {36}, 
   * we count unique matches.
   */
  static calculateMatch(userScores: number[], drawNumbers: number[]): number {
    const uniqueUserScores = new Set(userScores);
    const uniqueDrawNumbers = new Set(drawNumbers);
    
    let matchCount = 0;
    for (const score of uniqueUserScores) {
      if (uniqueDrawNumbers.has(score)) {
        matchCount++;
      }
    }
    return matchCount;
  }

  /**
   * Runs a simulation for a given draw.
   */
  static async simulateDraw(drawId: string) {
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
    const numbers = this.generateNumbers();

    // 3. Calculate Winners
    let tier5 = 0;
    let tier4 = 0;
    let tier3 = 0;

    for (const user of validEntries) {
        const scores = user.scores.map(s => s.score);
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
