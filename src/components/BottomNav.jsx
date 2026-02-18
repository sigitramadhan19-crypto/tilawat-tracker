import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart3, PenLine, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import './BottomNav.css';

const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/progress', icon: BarChart3, label: 'Progress' },
    { path: '/log', icon: PenLine, label: 'Log' },

    { path: '/settings', icon: Settings, label: 'Pengaturan' },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav" id="bottom-nav">
            {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                    <NavLink key={path} to={path} className={`nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon-wrapper">
                            {isActive && (
                                <motion.div
                                    className="nav-active-bg"
                                    layoutId="activeTab"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                        </div>
                        <span className="nav-label">{label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
