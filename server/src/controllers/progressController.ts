
import { Request, Response } from "express";
import { progressService } from "../services/progressService";

export const progressController = {
    getStats: async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        try {
            const stats = await progressService.getStats(req.user.id);
            res.json(stats);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to fetch stats" });
        }
    }
};
