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

// 2. SAJIKAN FILE FRONTEND
// Gunakan path.resolve agar lebih akurat menentukan lokasi folder dist
const distPath = path.resolve(__dirname, "../../dist");
// Catatan: Jika app.ts Anda ada di server/src, maka saat jadi JS di server/dist/src, 
// kita butuh naik 2 tingkat (../../) untuk ketemu folder dist frontend.

app.use(express.static(distPath));

// Mount Better Auth handler
app.use("/api/auth", (req, res) => {
    return toNodeHandler(auth)(req, res);
});

// Mount API routes
app.use("/api", routes);

// 3. FALLBACK ROUTE
app.get("*", (req, res) => {
    // Pastikan jalur ke index.html juga benar
    res.sendFile(path.join(distPath, "index.html"), (err) => {
        if (err) {
            // Jika error, bantu diagnosa lewat log Railway
            console.error("File index.html tidak ditemukan di:", path.join(distPath, "index.html"));
            res.status(500).send("Terjadi kesalahan pada server (Frontend path error)");
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});