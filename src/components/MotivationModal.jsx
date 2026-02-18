import { motion, AnimatePresence } from 'framer-motion';
import { getRandomQuote } from '../data/quranData';
import { useState, useEffect, useMemo } from 'react';
import { X, Sparkles } from 'lucide-react';
import './MotivationModal.css';

const confettiColors = ['#d4af37', '#f0d060', '#2dd4bf', '#5eead4', '#22c55e', '#f59e0b'];

function ConfettiPiece({ index }) {
    const style = {
        left: `${Math.random() * 100}%`,
        backgroundColor: confettiColors[index % confettiColors.length],
        animationDelay: `${Math.random() * 1.5}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
        width: `${6 + Math.random() * 8}px`,
        height: `${6 + Math.random() * 8}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    };
    return <div className="confetti-piece" style={style} />;
}

export default function MotivationModal({ isOpen, onClose, milestone = false }) {
    const quote = useMemo(() => getRandomQuote(), [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {milestone && (
                        <div className="confetti-container">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <ConfettiPiece key={i} index={i} />
                            ))}
                        </div>
                    )}

                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className="modal-content motivation-modal"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={onClose}>
                                <X size={20} />
                            </button>

                            <div className="motivation-icon">
                                <Sparkles size={32} color="#d4af37" />
                            </div>

                            <h3 className="motivation-title">
                                {milestone ? 'Masya Allah! 🎉' : 'Barakallah! ✨'}
                            </h3>

                            <p className="motivation-subtitle">
                                {milestone
                                    ? 'Kamu telah mencapai milestone baru!'
                                    : 'Bacaan hari ini telah dicatat.'}
                            </p>

                            <div className="motivation-quote">
                                <p className="quote-arabic">{quote.arabic}</p>
                                <p className="quote-translation">"{quote.translation}"</p>
                                <p className="quote-source">— {quote.source}</p>
                            </div>

                            <button className="btn-gold motivation-cta" onClick={onClose}>
                                Lanjutkan
                            </button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
