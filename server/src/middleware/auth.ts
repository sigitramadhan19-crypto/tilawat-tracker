
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";
import { Request, Response, NextFunction } from "express";

export const getSession = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (session) {
        req.user = session.user;
        req.session = session.session;
    }
    next();
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
};
