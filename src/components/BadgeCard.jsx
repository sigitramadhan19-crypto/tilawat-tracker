import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import './BadgeCard.css';

export default function BadgeCard({ badge, unlocked = false }) {
    return (
        <motion.div
            className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
            whileHover={unlocked ? { scale: 1.05 } : {}}
            whileTap={unlocked ? { scale: 0.98 } : {}}
        >
            <div className="badge-icon-wrapper">
                {unlocked ? (
                    <span className="badge-icon">{badge.icon}</span>
                ) : (
                    <Lock size={20} className="badge-lock-icon" />
                )}
            </div>
            <span className="badge-name">{badge.name}</span>
            <span className="badge-desc">{badge.description}</span>
        </motion.div>
    );
}
