import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import routes from "./routes";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

app.use(cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Mount Better Auth handler
app.use("/api/auth", (req, res) => {
    return toNodeHandler(auth)(req, res);
});

// Mount API routes
app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Tilawat Tracker API is running!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
