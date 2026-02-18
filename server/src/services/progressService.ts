import { db } from "../db";
import { userProgress, goals } from "../db/schema";
import { eq } from "drizzle-orm";
// Since we are in server, we should redefine or share constants.
// Let's redefine for simplicity.

const PAGES_IN_QURAN = 604;

export const progressService = {
    getStats: async (userId: string) => {
        // Fetch Goal
        const goal = await db.query.goals.findFirst({
            where: eq(goals.userId, userId),
        });

        // Fetch Progress
        let progress = await db.query.userProgress.findFirst({
            where: eq(userProgress.userId, userId),
        });

        if (!progress) {
            // Return empty defaults if no progress yet
            return {
                totalPagesRead: 0,
                completedJuz: 0,
                currentStreak: 0,
                pagesPerDay: 20, // Default fallback
                // ... other defaults
            };
        }

        // Calculation Logic
        let pagesPerDay = 20; // Default
        let remainingPages = 0;
        let daysRemaining = 0;

        if (goal) {
            const totalTargetPages = PAGES_IN_QURAN * (goal.targetKhatam || 1);
            remainingPages = Math.max(0, totalTargetPages - (progress.totalPagesRead || 0));

            // Calculate days remaining
            const startDate = new Date(goal.startDate);
            const targetDays = goal.targetDays || 30;
            const targetEndDate = new Date(startDate);
            targetEndDate.setDate(targetEndDate.getDate() + targetDays);

            const now = new Date();
            const msPerDay = 1000 * 60 * 60 * 24;
            daysRemaining = Math.max(1, Math.ceil((targetEndDate.getTime() - now.getTime()) / msPerDay));

            pagesPerDay = Math.ceil(remainingPages / daysRemaining);
        }

        return {
            ...progress,
            completedJuz: progress.completedJuzCount, // Mapping for frontend
            pagesPerDay,
            pagesPerShalat: Math.ceil(pagesPerDay / 5),
            remainingPages,
            daysRemaining,
            goalTarget: goal,
        };
    }
};
