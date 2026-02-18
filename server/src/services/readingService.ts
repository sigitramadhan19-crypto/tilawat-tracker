
import { db } from "../db";
import { readingLogs, userProgress, goals } from "../db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";

export const readingService = {
    logReading: async (userId: string, date: string, juzNumbers: number[], pagesRead: number) => {
        // 1. Insert Log
        const log = await db.insert(readingLogs).values({
            userId,
            date,
            juzCompleted: juzNumbers,
            pagesRead,
        }).returning();

        // 2. Update Progress & Streak
        let progress = await db.query.userProgress.findFirst({
            where: eq(userProgress.userId, userId),
        });

        if (!progress) {
            // Initialize progress if not exists
            [progress] = await db.insert(userProgress).values({
                userId,
                currentStreak: 0,
                longestStreak: 0,
                totalPagesRead: 0,
                completedJuzCount: 0,
                fajrReadCount: 0,
            }).returning();
        }

        const lastRead = progress.lastReadDate;
        let newStreak = progress.currentStreak || 0;

        // Calculate Streak
        const todayDate = new Date(date);
        const yesterdayDate = new Date(todayDate);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayString = yesterdayDate.toISOString().split('T')[0];

        if (lastRead === date) {
            // Already read today, no streak change
        } else if (lastRead === yesterdayString) {
            newStreak += 1;
        } else {
            // Streak broken or first time
            newStreak = 1;
        }

        const newLongestStreak = Math.max(progress.longestStreak || 0, newStreak);

        // Check Fajr (Hardcoded for now, ideally passed from client based on local time)
        // For simplicity, we'll assume the client flags if it's fajr, or ignore for now.
        // If we want to support Fajr badge, we might need 'readAt' time check on server, 
        // but 'date' passed from client is just a string. 
        // We'll increment fajr count if the log timestamp (now) is < 6am local? 
        // Hard to know user's local time without timezone.
        // Let's increment total pages.

        await db.update(userProgress)
            .set({
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                lastReadDate: date,
                totalPagesRead: (progress.totalPagesRead || 0) + pagesRead,
                completedJuzCount: (progress.completedJuzCount || 0) + juzNumbers.length,
                updatedAt: new Date(),
            })
            .where(eq(userProgress.userId, userId));

        return { log, newStreak };
    },

    getLogs: async (userId: string, startDate?: string, endDate?: string) => {
        // Simple fetch
        return await db.query.readingLogs.findMany({
            where: and(
                eq(readingLogs.userId, userId),
                startDate ? gte(readingLogs.date, startDate) : undefined,
                endDate ? lte(readingLogs.date, endDate) : undefined
            ),
            orderBy: desc(readingLogs.date),
        });
    }
};
