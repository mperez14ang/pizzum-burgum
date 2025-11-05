import { useEffect } from 'react';
import { useAuth } from "./AuthContext.jsx";

export const useSessionChecker = (
    handleNavigate,
    setPrevPageType,
    currentPage,
    intervalMs = 30000
) => {
    const { user, checkUser, logout } = useAuth();

    useEffect(() => {
        if (!user) return;

        if (currentPage === 'session-expired') return;

        const intervalId = setInterval(async () => {
            try {
                const isValid = await checkUser(false);
                if (!isValid) {
                    console.warn('Sesión expirada (checker automático)');
                    await logout();

                    handleNavigate('session-expired', false);

                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error('Error verificando sesión:', err);
            }
        }, intervalMs);

        return () => clearInterval(intervalId);

    }, [user, checkUser, logout, handleNavigate, currentPage, intervalMs]);
};
