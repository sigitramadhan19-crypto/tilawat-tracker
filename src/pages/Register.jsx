import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { data: session } = authClient.useSession();
    useEffect(() => {
        if (session) {
            navigate('/dashboard');
        }
    }, [session, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Password dan Konfirmasi Password tidak sama.');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password minimal 8 karakter.');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (error) {
                setError(error.message || 'Registrasi gagal. Email mungkin sudah terdaftar.');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full block pl-12 pr-12 py-3.5 sm:py-4 rounded-xl outline-none transition-all placeholder:text-[rgba(255,255,255,0.2)] text-sm sm:text-base border border-[var(--border-card)] bg-[rgba(0,0,0,0.2)] text-[var(--text-primary)] focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)]";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="bg-decoration"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[420px] relative z-10"
            >
                <div className="text-center mb-8 sm:mb-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-center mb-4"
                    >
                        <Sparkles className="text-[var(--teal)] w-8 h-8 sm:w-10 sm:h-10" />
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                        Mulai Tracking Baccan Qur'anmu
                    </h1>

                </div>

                <GlassCard className="p-6 sm:p-8 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] !bg-[rgba(15,31,58,0.6)] shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[var(--teal)] opacity-10 blur-3xl rounded-full pointer-events-none -mr-12 -mt-12 sm:-mr-16 sm:-mt-16"></div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 sm:p-4 rounded-xl mb-6 text-[13px] sm:text-sm flex items-center gap-3"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider ml-1 text-[var(--teal)]">Nama Lengkap</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--teal)] text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className={inputClasses}
                                    placeholder="Nama Antum"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider ml-1 text-[var(--teal)]">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--teal)] text-[var(--text-muted)]" />
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
                            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider ml-1 text-[var(--teal)]">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--teal)] text-[var(--text-muted)]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={inputClasses}
                                    placeholder="Min. 8 karakter"
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

                        <div className="space-y-3">
                            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider ml-1 text-[var(--teal)]">Konfirmasi Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--teal)] text-[var(--text-muted)]" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className={inputClasses}
                                    placeholder="Ulangi password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors p-2"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-teal font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(45,212,191,0.2)] hover:shadow-[0_6px_25px_rgba(45,212,191,0.4)] transform hover:-translate-y-0.5 text-base"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Buat Akun
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </GlassCard>

                <div className="mt-8 text-center px-4" style={{ color: 'var(--text-secondary)' }}>
                    <p className="text-sm">Sudah punya akun?</p>
                    <Link to="/login" className="inline-flex items-center gap-1 mt-2 text-[var(--gold)] font-semibold hover:text-[var(--gold-light)] transition-colors text-base">
                        Masuk Disini <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}