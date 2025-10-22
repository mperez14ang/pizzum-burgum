import {LogOut, ShoppingCart, User} from 'lucide-react';
import {useAuth} from '../../contexts/AuthContext';
import {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {Modal} from './Modal';
import toast from 'react-hot-toast';
import {AuthPage} from "../../pages/AuthPage.jsx";

export const Header = forwardRef((props, ref) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authType, setAuthType] = useState('login'); // 'login' or 'register'

    // Close modal when user becomes authenticated
    useEffect(() => {
        if (isAuthenticated) {
            setIsAuthModalOpen(false);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        toast.success('Sesión cerrada');
    };

    const handleOpenLogin = () => {
        setAuthType('login');
        setIsAuthModalOpen(true);
    };

    const handleToggleAuthType = () => {
        setAuthType(prev => prev === 'login' ? 'register' : 'login');
    };

    // Expose handleOpenLogin to parent via ref
    useImperativeHandle(ref, () => ({
        openLoginModal: handleOpenLogin
    }));

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">PizzUM & BurgUM</h1>
                        <div className="flex gap-4 items-center">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <ShoppingCart className="w-6 h-6" />
                            </button>

                            {isAuthenticated ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 hidden sm:inline">
                                        {user?.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                        title="Cerrar sesión"
                                    >
                                        <LogOut className="w-6 h-6" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleOpenLogin}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                    title="Iniciar sesión"
                                >
                                    <User className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Login & Register Modal */}
            {!isAuthenticated && (
                <Modal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    title={authType === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                    size="md"
                >
                    <AuthPage type={authType} onToggleAuthType={handleToggleAuthType} />
                </Modal>
            )}
        </>
    );
});

Header.displayName = 'Header';