import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, X } from 'lucide-react';

export default function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            // eslint-disable-next-line no-console
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            // eslint-disable-next-line no-console
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    return (
        <AnimatePresence>
            {(offlineReady || needRefresh) && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-24 left-4 right-4 sm:right-auto sm:left-6 z-50 p-4 bg-[rgba(15,31,58,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl max-w-sm ring-1 ring-white/10"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm mb-1">
                                {offlineReady ? 'Siap Offline' : 'Update Tersedia'}
                            </h3>
                            <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                                {offlineReady
                                    ? 'Aplikasi siap digunakan tanpa internet.'
                                    : 'Versi terbaru aplikasi tersedia. Muat ulang sekarang?'}
                            </p>
                        </div>
                        <button
                            onClick={close}
                            className="p-1 -mr-2 -mt-2 text-[var(--text-muted)] hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {needRefresh && (
                        <button
                            onClick={() => updateServiceWorker(true)}
                            className="mt-3 w-full btn-teal py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <RotateCw size={14} className="animate-spin-slow" />
                            Muat Ulang
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
