import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import './SplashScreen.css';

export default function SplashScreen({ onboardingComplete }) {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true });
        }, 2200);
        return () => clearTimeout(timer);
    }, [navigate, onboardingComplete]);

    return (
        <div className="splash-screen">
            <div className="bg-decoration" />

            <motion.div
                className="splash-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.div
                    className="splash-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <BookOpen size={48} strokeWidth={1.5} />
                </motion.div>

                <motion.h1
                    className="splash-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    Tilawat Tracker
                </motion.h1>

                <motion.p
                    className="splash-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    Pelacak Tilawah Al-Qur'an
                </motion.p>

                <motion.div
                    className="splash-loader"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 1.2, ease: 'easeInOut' }}
                />
            </motion.div>

            <motion.p
                className="splash-bismillah"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
            >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </motion.p>
        </div>
    );
}
