import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { data: session } = authClient.useSession();
    useEffect(() => {
        if (session) {
            navigate('/dashboard');
        }
    }, [session, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                // Better error messages
                if (error.status === 401 || error.status === 403) {
                    setError('Email atau password salah.');
                } else {
                    setError(error.message || 'Login gagal. Silakan coba lagi.');
                }
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi. Periksa internet Anda.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full block pl-12 pr-12 py-3.5 sm:py-4 rounded-xl outline-none transition-all placeholder:text-[rgba(255,255,255,0.2)] text-sm sm:text-base border border-[var(--border-card)] bg-[rgba(0,0,0,0.2)] text-[var(--text-primary)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="bg-decoration"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[420px] relative z-10"
            >
                <div className="text-center mb-8 sm:mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block mb-4"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] flex items-center justify-center shadow-[var(--shadow-gold)] mx-auto rotate-3">
                            <span className="text-3xl">🌙</span>
                        </div>
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight" style={{
                        background: 'linear-gradient(135deg, #fff, var(--text-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Ahlan!
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg">Lanjutkan tilawah harianmu</p>
                </div>

                <GlassCard className="p-6 sm:p-8 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] !bg-[rgba(15,31,58,0.6)] shadow-2xl rounded-2xl sm:rounded-3xl">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 rounded-xl mb-6 text-sm flex items-center gap-3"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium ml-1 text-[var(--text-muted)]">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--gold)] text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={inputClasses}
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium ml-1 text-[var(--text-muted)]">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--gold)] text-[var(--text-muted)]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={inputClasses}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors p-2"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="text-right pt-1">
                            <a href="#" className="text-sm text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">Lupa passwords?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gold font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] transform hover:-translate-y-0.5 text-base"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Masuk Sekarang
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </GlassCard>

                <div className="mt-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                    <p className="text-sm">Belum memiliki akun?</p>
                    <Link to="/register" className="inline-flex items-center gap-1 mt-2 text-[var(--teal)] font-semibold hover:text-[var(--teal-light)] transition-colors text-base">
                        Daftar Gratis <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
