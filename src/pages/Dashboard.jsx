import { motion } from 'framer-motion';
import { Flame, BookOpen, AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import GlassCard from '../components/GlassCard';
import { getRandomQuote } from '../data/quranData';
import { useMemo } from 'react';
import './Dashboard.css';

export default function Dashboard({ progress, getPercentage, getTodayTarget, getDailyTarget, isTodayComplete, quickCompleteToday }) {
    const percentage = getPercentage();
    const todayTarget = getTodayTarget();
    const dailyTarget = getDailyTarget();
    const todayDone = isTodayComplete();
    const ayatOfDay = useMemo(() => getRandomQuote(), []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            className="page dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="bg-decoration" />

            {/* Header */}
            <motion.div className="dashboard-header" variants={itemVariants}>
                <h1 className="dashboard-title">Tilawat Tracker</h1>
                <p className="dashboard-greeting">Semangat tilawahnya hari ini! 🌙</p>
            </motion.div>

            {/* Progress Ring */}
            <motion.div variants={itemVariants}>
                <ProgressRing percentage={percentage} size={200} />
            </motion.div>

            {/* Today's Reading Target */}
            <motion.div variants={itemVariants}>
                <GlassCard className="target-card" glow={todayDone ? 'success' : 'gold'}>
                    <div className="target-card-header">
                        <BookOpen size={18} color={todayDone ? '#22c55e' : '#d4af37'} />
                        <span className="target-card-label">Bacaan Hari Ini</span>
                        {todayDone && <span className="target-done-badge">✓ Selesai</span>}
                    </div>
                    {todayTarget.isComplete ? (
                        <p className="target-complete-text">🎉 Alhamdulillah, Khatam!</p>
                    ) : (
                        <>
                            <h3 className="target-surah">{todayTarget.surah}</h3>
                            <p className="target-ayat">Ayat {todayTarget.ayat} · Juz {todayTarget.juz}</p>
                            <p className="target-pages">
                                {dailyTarget.pagesPerDay} halaman/hari
                                {progress.distributionMode === 'per_shalat' && ` · ${dailyTarget.pagesPerShalat} halaman/shalat`}
                            </p>
                        </>
                    )}
                </GlassCard>
            </motion.div>

            {/* Streak & Quick Stats Row */}
            <motion.div className="stats-row" variants={itemVariants}>
                <GlassCard className="stat-card streak-card">
                    <Flame size={24} color="#f59e0b" className="animate-float" />
                    <span className="stat-value">{progress.currentStreak}</span>
                    <span className="stat-label">Hari Berturut</span>
                </GlassCard>

                <GlassCard className="stat-card">
                    <Zap size={24} color="#2dd4bf" />
                    <span className="stat-value">{progress.completedJuz}</span>
                    <span className="stat-label">Juz Selesai</span>
                </GlassCard>

                <GlassCard className="stat-card">
                    <BookOpen size={24} color="#d4af37" />
                    <span className="stat-value">{progress.totalPagesRead}</span>
                    <span className="stat-label">Halaman</span>
                </GlassCard>
            </motion.div>

            {/* Catch-up Alert */}
            {dailyTarget.pagesPerDay > 25 && !todayTarget.isComplete && (
                <motion.div variants={itemVariants}>
                    <GlassCard className="catchup-alert">
                        <AlertTriangle size={18} color="#f59e0b" />
                        <div>
                            <p className="catchup-title">Catch-up Mode Aktif</p>
                            <p className="catchup-text">
                                Targetmu naik jadi {dailyTarget.pagesPerDay} halaman/hari.
                                Sisa {dailyTarget.remainingDays} hari lagi. Kamu bisa! 💪
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Ayat Hari Ini */}
            <motion.div variants={itemVariants}>
                <GlassCard className="ayat-card">
                    <span className="ayat-label">✨ Ayat Hari Ini</span>
                    <p className="ayat-arabic">{ayatOfDay.arabic}</p>
                    <p className="ayat-translation">"{ayatOfDay.translation}"</p>
                    <p className="ayat-source">{ayatOfDay.source}</p>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
