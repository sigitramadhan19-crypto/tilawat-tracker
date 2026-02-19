import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import path from "path";
import routes from "./routes";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

const app = express();
const port = process.env.PORT || 3000;


const rootPath = process.cwd();
const distPath = path.join(process.cwd(), "dist");

app.use(cors({
    origin: process.env.CORS_ORIGIN || process.env.BETTER_AUTH_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use(express.static(distPath));

app.use("/api/auth", (req, res) => {
    return toNodeHandler(auth)(req, res);
});
app.use("/api", routes);

app.get("/{*path}", (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) {
                console.error("LOG ERROR PATH:", path.join(distPath, "index.html"));
                res.status(500).send("Frontend dist tidak ditemukan. Cek log Railway.");
            }
        });
    } else {
        res.status(404).json({ error: "Endpoint not found" });
    }
});


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});