
import { db } from "../db";
import { goals } from "../db/schema";
import { eq } from "drizzle-orm";

export const goalService = {
    getGoal: async (userId: string) => {
        const goal = await db.query.goals.findFirst({
            where: eq(goals.userId, userId),
        });
        return goal;
    },

    createOrUpdateGoal: async (userId: string, data: Partial<typeof goals.$inferInsert>) => {
        const existing = await goalService.getGoal(userId);

        if (existing) {
            const [updated] = await db.update(goals)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(goals.id, existing.id))
                .returning();
            return updated;
        } else {
            const [created] = await db.insert(goals)
                .values({ ...data, userId } as typeof goals.$inferInsert)
                .returning();
            return created;
        }
    }
};
