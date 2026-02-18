import { Navigate, useLocation } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { Loader2 } from 'lucide-react';

export default function RequireAuth({ children }) {
    const { data: session, isPending } = authClient.useSession();
    const location = useLocation();

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
