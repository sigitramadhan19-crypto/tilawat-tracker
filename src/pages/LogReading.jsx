import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, CheckCircle2, PenLine, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import MotivationModal from '../components/MotivationModal';
import { juzData, TOTAL_JUZ } from '../data/quranData';
import './LogReading.css';

export default function LogReading({ progress, logReading }) {
    const [mode, setMode] = useState('quick'); // 'quick' | 'manual'
    const [selectedJuz, setSelectedJuz] = useState(null);
    const [showMotivation, setShowMotivation] = useState(false);
    const [isMilestone, setIsMilestone] = useState(false);

    // Find next unread juz
    const nextJuzIndex = progress.juzStatus.findIndex(s => s !== 'completed');
    const nextJuz = nextJuzIndex >= 0 ? nextJuzIndex + 1 : null;

    const handleQuickLog = () => {
        if (nextJuz) {
            logReading([nextJuz], juzData[nextJuz - 1].pages);
            // Check if milestone
            const newCompletedCount = progress.completedJuz + 1;
            setIsMilestone(newCompletedCount % 5 === 0 || newCompletedCount === 15 || newCompletedCount === 30);
            setShowMotivation(true);
        }
    };

    const handleManualLog = () => {
        if (selectedJuz) {
            logReading([selectedJuz], juzData[selectedJuz - 1].pages);
            const newCompletedCount = progress.juzStatus.filter(s => s === 'completed').length + 1;
            setIsMilestone(newCompletedCount % 5 === 0 || newCompletedCount === 15 || newCompletedCount === 30);
            setShowMotivation(true);
            setSelectedJuz(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            className="page log-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="page-header" variants={itemVariants}>
                <h1>Log Bacaan</h1>
                <p>Catat progress tilawahmu</p>
            </motion.div>

            {/* Mode Toggle */}
            <motion.div className="mode-toggle" variants={itemVariants}>
                <button
                    className={`mode-btn ${mode === 'quick' ? 'active' : ''}`}
                    onClick={() => setMode('quick')}
                >
                    <Zap size={16} /> Quick Log
                </button>
                <button
                    className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
                    onClick={() => setMode('manual')}
                >
                    <PenLine size={16} /> Manual
                </button>
            </motion.div>

            {mode === 'quick' ? (
                /* Quick Log Mode */
                <motion.div className="quick-log" variants={itemVariants}>
                    {nextJuz ? (
                        <>
                            <GlassCard className="quick-target" glow="teal">
                                <BookMarked size={24} color="#2dd4bf" />
                                <div className="quick-target-info">
                                    <span className="quick-target-label">Target selanjutnya</span>
                                    <span className="quick-target-juz">Juz {nextJuz}</span>
                                    <span className="quick-target-detail">{juzData[nextJuz - 1].surah}</span>
                                </div>
                            </GlassCard>

                            <motion.button
                                className="quick-log-btn"
                                onClick={handleQuickLog}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <CheckCircle2 size={28} />
                                <span>Selesai Juz {nextJuz}</span>
                            </motion.button>
                        </>
                    ) : (
                        <GlassCard className="all-done-card" glow="gold">
                            <span className="all-done-emoji">🌟</span>
                            <h3>Alhamdulillah!</h3>
                            <p>Semua 30 Juz telah selesai!</p>
                        </GlassCard>
                    )}
                </motion.div>
            ) : (
                /* Manual Log Mode */
                <motion.div className="manual-log" variants={itemVariants}>
                    <p className="manual-instruction">Pilih Juz yang telah kamu selesaikan:</p>
                    <div className="juz-select-grid">
                        {juzData.map((juz, index) => {
                            const status = progress.juzStatus[index];
                            const isSelected = selectedJuz === juz.juz;
                            return (
                                <motion.button
                                    key={juz.juz}
                                    className={`juz-select-btn ${status} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => status !== 'completed' && setSelectedJuz(juz.juz)}
                                    disabled={status === 'completed'}
                                    whileHover={status !== 'completed' ? { scale: 1.05 } : {}}
                                    whileTap={status !== 'completed' ? { scale: 0.95 } : {}}
                                >
                                    <span className="juz-select-num">{juz.juz}</span>
                                    {status === 'completed' && <span className="juz-select-check">✓</span>}
                                </motion.button>
                            );
                        })}
                    </div>

                    {selectedJuz && (
                        <motion.div
                            className="manual-confirm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard glow="teal">
                                <p className="confirm-text">
                                    Tandai <strong>Juz {selectedJuz}</strong> ({juzData[selectedJuz - 1].surah}) sebagai selesai?
                                </p>
                                <button className="btn-gold confirm-btn" onClick={handleManualLog}>
                                    ✓ Konfirmasi
                                </button>
                            </GlassCard>
                        </motion.div>
                    )}
                </motion.div>
            )}

            <MotivationModal
                isOpen={showMotivation}
                onClose={() => setShowMotivation(false)}
                milestone={isMilestone}
            />
        </motion.div>
    );
}
