import { motion } from 'framer-motion';
import { juzData } from '../data/quranData';
import GlassCard from '../components/GlassCard';
import BadgeCard from '../components/BadgeCard';
import { useBadges } from '../hooks/useBadges';
import { BookOpen, TrendingUp, Calendar } from 'lucide-react';
import './Progress.css';

export default function Progress({ progress, getPercentage, getConsistency }) {
    const percentage = getPercentage();
    const consistency = getConsistency();
    const { unlockedBadges, lockedBadges, level } = useBadges(progress);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    };

    return (
        <motion.div
            className="page progress-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="page-header" variants={itemVariants}>
                <h1>Perjalanan Tilawah</h1>
                <p>Peta progress menuju Khatam</p>
            </motion.div>

            {/* Mushaf Map */}
            <motion.div variants={itemVariants}>
                <GlassCard className="mushaf-section">
                    <h3 className="section-title">📖 Peta Mushaf</h3>
                    <div className="mushaf-grid">
                        {juzData.map((juz, index) => {
                            const status = progress.juzStatus[index];
                            return (
                                <motion.div
                                    key={juz.juz}
                                    className={`juz-cell ${status}`}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={`${juz.surah}\n${juz.ayat}`}
                                >
                                    <span className="juz-number">Juz {juz.juz}</span>
                                    {status === 'completed' && <span className="juz-check">✓</span>}
                                    {status === 'in_progress' && <span className="juz-progress-dot" />}
                                </motion.div>
                            );
                        })}
                    </div>
                    <div className="mushaf-legend">
                        <span className="legend-item"><span className="legend-dot completed" /> Selesai</span>
                        <span className="legend-item"><span className="legend-dot in_progress" /> Sedang Dibaca</span>
                        <span className="legend-item"><span className="legend-dot not_started" /> Belum</span>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Level & XP */}
            <motion.div variants={itemVariants}>
                <GlassCard className="level-card" glow="gold">
                    <div className="level-header">
                        <span className="level-icon">{level.current.icon}</span>
                        <div>
                            <span className="level-name">{level.current.name}</span>
                            {level.next && (
                                <span className="level-next">→ {level.next.name}</span>
                            )}
                        </div>
                        <span className="level-xp">{level.xp} XP</span>
                    </div>
                    {level.next && (
                        <div className="xp-bar-container">
                            <motion.div
                                className="xp-bar-fill"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.min(100, ((level.xp - level.current.minXP) / (level.next.minXP - level.current.minXP)) * 100)}%`,
                                }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    )}
                </GlassCard>
            </motion.div>

            {/* Badges */}
            <motion.div variants={itemVariants}>
                <GlassCard className="badges-section">
                    <h3 className="section-title">🏅 Pencapaian</h3>
                    <div className="badges-grid">
                        {unlockedBadges.map(badge => (
                            <BadgeCard key={badge.id} badge={badge} unlocked />
                        ))}
                        {lockedBadges.map(badge => (
                            <BadgeCard key={badge.id} badge={badge} unlocked={false} />
                        ))}
                    </div>
                </GlassCard>
            </motion.div>

            {/* Stats */}
            <motion.div className="progress-stats" variants={itemVariants}>
                <GlassCard className="pstat-card">
                    <BookOpen size={20} color="#d4af37" />
                    <span className="pstat-value">{progress.totalPagesRead}</span>
                    <span className="pstat-label">Halaman Dibaca</span>
                </GlassCard>
                <GlassCard className="pstat-card">
                    <Calendar size={20} color="#2dd4bf" />
                    <span className="pstat-value">{progress.activeDays}</span>
                    <span className="pstat-label">Hari Aktif</span>
                </GlassCard>
                <GlassCard className="pstat-card">
                    <TrendingUp size={20} color="#22c55e" />
                    <span className="pstat-value">{consistency}%</span>
                    <span className="pstat-label">Konsistensi</span>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
