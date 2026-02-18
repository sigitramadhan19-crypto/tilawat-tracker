import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Tambahkan ini
import routes from "./routes";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 1. UPDATE CORS: Izinkan domain Railway Anda
app.use(cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// 2. SAJIKAN FILE FRONTEND (Folder dist)
// Ini agar tampilan aplikasi muncul saat link dibuka
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Mount Better Auth handler
app.use("/api/auth", (req, res) => {
    return toNodeHandler(auth)(req, res);
});

// Mount API routes
app.use("/api", routes);

// 3. FALLBACK ROUTE: Penting agar saat refresh halaman tidak error 404
app.get("*", (req, res) => {
    // Jika request bukan untuk API, berikan file index.html dari frontend
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, "index.html"));
    }
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});