export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications
        },
    }),
    // AMAN: Izinkan domain aplikasi Anda sendiri
    trustedOrigins: [
        process.env.BETTER_AUTH_URL || "https://tilawat-tracker-production.up.railway.app", // Ini akan mengambil URL dari Railway
    ],
    emailAndPassword: {
        enabled: true,
    },
});