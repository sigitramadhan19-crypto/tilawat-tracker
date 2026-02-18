import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Bell, BookOpen, RotateCcw, Info, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import GlassCard from '../components/GlassCard';
import './Settings.css';

export default function Settings({ progress, updateSettings, resetProgress }) {
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [targetDays, setTargetDays] = useState(progress.targetDays);
    const [targetKhatam, setTargetKhatam] = useState(progress.targetKhatam);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [ayatEnabled, setAyatEnabled] = useState(true);
    const navigate = useNavigate();

    const handleSaveTarget = () => {
        updateSettings({ targetDays, targetKhatam });
    };

    const handleReset = () => {
        resetProgress();
        setShowResetConfirm(false);
    };

    const handleLogout = async () => {
        await authClient.signOut();
        navigate('/login');
    };

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
            className="page settings-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="page-header" variants={itemVariants}>
                <h1>Pengaturan</h1>
                <p>Sesuaikan targetmu</p>
            </motion.div>

            {/* Target Settings */}
            <motion.div variants={itemVariants}>
                <GlassCard className="settings-section">
                    <div className="settings-section-header">
                        <Target size={18} color="#d4af37" />
                        <h3>Target Bacaan</h3>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">Target Khatam</span>
                        <div className="setting-stepper">
                            <button className="stepper-btn" onClick={() => setTargetKhatam(Math.max(1, targetKhatam - 1))}>−</button>
                            <span className="stepper-value">{targetKhatam}</span>
                            <button className="stepper-btn" onClick={() => setTargetKhatam(targetKhatam + 1)}>+</button>
                        </div>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">Durasi (hari)</span>
                        <div className="setting-stepper">
                            <button className="stepper-btn" onClick={() => setTargetDays(Math.max(7, targetDays - 5))}>−</button>
                            <span className="stepper-value">{targetDays}</span>
                            <button className="stepper-btn" onClick={() => setTargetDays(targetDays + 5)}>+</button>
                        </div>
                    </div>

                    <button className="btn-teal save-btn" onClick={handleSaveTarget}>
                        Simpan Target
                    </button>
                </GlassCard>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={itemVariants}>
                <GlassCard className="settings-section">
                    <div className="settings-section-header">
                        <Bell size={18} color="#2dd4bf" />
                        <h3>Notifikasi</h3>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">Pengingat Shalat</span>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                            />
                            <span className="toggle-slider" />
                        </label>
                    </div>

                    <div className="setting-row">
                        <span className="setting-label">Motivasi Pagi</span>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={ayatEnabled}
                                onChange={(e) => setAyatEnabled(e.target.checked)}
                            />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Ayat Hari Ini */}
            <motion.div variants={itemVariants}>
                <GlassCard className="settings-section">
                    <div className="settings-section-header">
                        <BookOpen size={18} color="#d4af37" />
                        <h3>Ayat Hari Ini</h3>
                    </div>
                    <div className="setting-row">
                        <span className="setting-label">Tampilkan di Dashboard</span>
                        <label className="toggle">
                            <input type="checkbox" checked={ayatEnabled} onChange={(e) => setAyatEnabled(e.target.checked)} />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Danger Zone */}
            <motion.div variants={itemVariants}>
                <GlassCard className="settings-section danger-zone">
                    <div className="settings-section-header">
                        <RotateCcw size={18} color="#ef4444" />
                        <h3>Reset</h3>
                    </div>
                    {!showResetConfirm ? (
                        <button className="reset-btn" onClick={() => setShowResetConfirm(true)}>
                            Reset Semua Progress
                        </button>
                    ) : (
                        <div className="reset-confirm">
                            <p className="reset-warning">⚠️ Semua data progress akan dihapus. Tindakan ini tidak bisa dibatalkan.</p>
                            <div className="reset-actions">
                                <button className="btn-outline" onClick={() => setShowResetConfirm(false)}>Batal</button>
                                <button className="reset-confirm-btn" onClick={handleReset}>Ya, Reset</button>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </motion.div>

            {/* Logout */}
            <motion.div variants={itemVariants}>
                <button
                    className="w-full btn-outline flex items-center justify-center gap-2 mt-4 text-red-400 border-red-400/30 hover:bg-red-500/10"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </motion.div>

            {/* About */}
            <motion.div variants={itemVariants}>
                <GlassCard className="about-card">
                    <Info size={16} color="var(--text-muted)" />
                    <div>
                        <span className="about-name">Tilawat Tracker By Sigit Ramadhan, S.Pd</span>
                        <span className="about-version">v1.0.0 — MVP</span>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
