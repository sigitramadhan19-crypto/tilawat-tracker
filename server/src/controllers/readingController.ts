
import { Request, Response } from "express";
import { readingService } from "../services/readingService";

export const readingController = {
    logReading: async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { date, juzNumbers, pagesRead } = req.body;
        // date format YYYY-MM-DD
        if (!date || pagesRead === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        try {
            const result = await readingService.logReading(req.user.id, date, juzNumbers || [], pagesRead);
            res.json(result);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to log reading" });
        }
    },

    getHistory: async (req: Request, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { startDate, endDate } = req.query as { startDate?: string, endDate?: string };

        try {
            const logs = await readingService.getLogs(req.user.id, startDate, endDate);
            res.json(logs);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to fetch history" });
        }
    }
};
