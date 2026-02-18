
import { Request, Response } from "express";
import { goalService } from "../services/goalService";

export const goalController = {
    getGoal: async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        try {
            const goal = await goalService.getGoal(req.user.id);
            res.json(goal || {});
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to fetch goal" });
        }
    },

    updateGoal: async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        try {
            const goal = await goalService.createOrUpdateGoal(req.user.id, req.body);
            res.json(goal);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to update goal" });
        }
    }
};
