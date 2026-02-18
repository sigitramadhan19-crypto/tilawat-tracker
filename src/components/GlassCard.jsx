import './GlassCard.css';

export default function GlassCard({ children, className = '', glow = '', onClick, style }) {
    return (
        <div
            className={`glass-card ${glow ? `glow-${glow}` : ''} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
