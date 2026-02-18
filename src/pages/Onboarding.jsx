import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Flame, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import './Onboarding.css';

const slides = [
    {
        icon: <BookOpen size={40} />,
        title: 'Assalamu\'alaikum! 🌙',
        subtitle: 'Selamat datang di Tilawat Tracker',
        description: 'Aplikasi pendamping tilawah Al-Qur\'an yang membantumu menjaga konsistensi bacaan setiap hari.',
    },
    {
        icon: <Target size={40} />,
        title: 'Target Cerdas 🎯',
        subtitle: 'Pecah target besar jadi kecil',
        description: 'Atur target khatam dan biarkan kami menghitung jadwal harianmu. Jika tertinggal, Catch-up Mode akan menyesuaikan otomatis.',
    },
    {
        icon: <Flame size={40} />,
        title: 'Tetap Semangat 🔥',
        subtitle: 'Streak, badges, dan motivasi',
        description: 'Kumpulkan streak harian, raih badges, dan dapatkan kutipan ayat penyemangat setiap hari.',
    },
];

export default function Onboarding({ onComplete }) {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [targetKhatam, setTargetKhatam] = useState(1);
    const [targetDays, setTargetDays] = useState(30);
    const [distributionMode, setDistributionMode] = useState('per_hari');

    const isLastSlide = currentSlide === slides.length;
    const totalSlides = slides.length + 1; // +1 for goal setting

    const pagesPerDay = Math.ceil((targetKhatam * 604) / targetDays);
    const pagesPerShalat = Math.ceil(pagesPerDay / 5);

    const handleNext = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const handleStart = () => {
        onComplete({
            targetKhatam,
            targetDays,
            distributionMode,
        });
        navigate('/dashboard', { replace: true });
    };

    const slideVariants = {
        enter: { x: 300, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -300, opacity: 0 },
    };

    return (
        <div className="onboarding-screen">
            <div className="bg-decoration" />

            <div className="onboarding-content">
                <AnimatePresence mode="wait">
                    {currentSlide < slides.length ? (
                        <motion.div
                            key={currentSlide}
                            className="onboarding-slide"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35 }}
                        >
                            <div className="slide-icon">{slides[currentSlide].icon}</div>
                            <h1 className="slide-title">{slides[currentSlide].title}</h1>
                            <p className="slide-subtitle">{slides[currentSlide].subtitle}</p>
                            <p className="slide-description">{slides[currentSlide].description}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="goal-setting"
                            className="goal-setting"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35 }}
                        >
                            <div className="slide-icon">
                                <Sparkles size={40} />
                            </div>
                            <h1 className="slide-title">Bismillah, Atur Targetmu 🎯</h1>
                            <p className="slide-subtitle">Tentukan tujuanmu, kami bantu rencanakan</p>

                            <div className="goal-form">
                                <GlassCard className="goal-card">
                                    <label className="goal-label">Target Khatam</label>
                                    <div className="goal-input-row">
                                        <button
                                            className="goal-btn"
                                            onClick={() => setTargetKhatam(Math.max(1, targetKhatam - 1))}
                                        >−</button>
                                        <span className="goal-value">{targetKhatam}</span>
                                        <button
                                            className="goal-btn"
                                            onClick={() => setTargetKhatam(targetKhatam + 1)}
                                        >+</button>
                                        <span className="goal-unit">Khatam</span>
                                    </div>
                                </GlassCard>

                                <GlassCard className="goal-card">
                                    <label className="goal-label">Dalam Waktu</label>
                                    <div className="goal-input-row">
                                        <button
                                            className="goal-btn"
                                            onClick={() => setTargetDays(Math.max(7, targetDays - 5))}
                                        >−</button>
                                        <span className="goal-value">{targetDays}</span>
                                        <button
                                            className="goal-btn"
                                            onClick={() => setTargetDays(targetDays + 5)}
                                        >+</button>
                                        <span className="goal-unit">Hari</span>
                                    </div>
                                </GlassCard>

                                <GlassCard className="goal-card calculator-card" glow="teal">
                                    <div className="calc-row">
                                        <div className="calc-item">
                                            <span className="calc-number">{pagesPerDay}</span>
                                            <span className="calc-label">halaman/hari</span>
                                        </div>
                                        <div className="calc-divider">≈</div>
                                        <div className="calc-item">
                                            <span className="calc-number">{pagesPerShalat}</span>
                                            <span className="calc-label">halaman/shalat</span>
                                        </div>
                                    </div>
                                </GlassCard>

                                <div className="distribution-chips">
                                    <span className="distribution-label">Distribusi:</span>
                                    {[
                                        { key: 'per_hari', label: '📅 Per Hari' },
                                        { key: 'per_shalat', label: '🕌 Per Shalat' },
                                        { key: 'bebas', label: '⏰ Waktu Bebas' },
                                    ].map(opt => (
                                        <button
                                            key={opt.key}
                                            className={`chip ${distributionMode === opt.key ? 'active' : ''}`}
                                            onClick={() => setDistributionMode(opt.key)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dots */}
                <div className="onboarding-dots">
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <div
                            key={i}
                            className={`dot ${i === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(i)}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div className="onboarding-nav">
                    {currentSlide > 0 && (
                        <button className="nav-btn prev" onClick={handlePrev}>
                            <ChevronLeft size={20} /> Kembali
                        </button>
                    )}
                    <div className="nav-spacer" />
                    {isLastSlide ? (
                        <button className="btn-gold start-btn" onClick={handleStart}>
                            Mulai Perjalanan ✨
                        </button>
                    ) : (
                        <button className="nav-btn next" onClick={handleNext}>
                            Lanjut <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
