import {LogOut, ShoppingCart, User, ChevronDown, History, UserCircle, MapPin, CreditCard, Star} from 'lucide-react';
import {useAuth} from '../../contexts/AuthContext';
import {useState, useEffect, forwardRef, useImperativeHandle, useRef} from 'react';
import {Modal} from './Modal';
import toast from 'react-hot-toast';
import {AuthPage} from "../../pages/AuthPage.jsx";

export const Header = forwardRef((props, ref) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authType, setAuthType] = useState('login'); // 'login' or 'register'
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close modal when user becomes authenticated
    useEffect(() => {
        if (isAuthenticated) {
            setIsAuthModalOpen(false);
        }
    }, [isAuthenticated]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        toast.success('Sesión cerrada', { duration: 2000 });
    };

    const handleMenuItemClick = (action) => {
        setIsDropdownOpen(false);
        // TODO: Implementar navegación a las páginas correspondientes
        toast.info(`Función "${action}" pendiente de implementar`, { duration: 2000 });
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
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {user?.firstName || user?.email}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <button
                                                onClick={() => handleMenuItemClick('Historial de Pedidos')}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                            >
                                                <History className="w-4 h-4" />
                                                Historial de Pedidos
                                            </button>

                                            <button
                                                onClick={() => handleMenuItemClick('Mi Perfil')}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                            >
                                                <UserCircle className="w-4 h-4" />
                                                Mi Perfil
                                            </button>

                                            <button
                                                onClick={() => handleMenuItemClick('Mis Direcciones')}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                Mis Direcciones
                                            </button>

                                            <button
                                                onClick={() => handleMenuItemClick('Métodos de Pago')}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Métodos de Pago
                                            </button>

                                            <button
                                                onClick={() => handleMenuItemClick('Mis Favoritos')}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                            >
                                                <Star className="w-4 h-4" />
                                                Mis Favoritos
                                            </button>

                                            <div className="border-t border-gray-200 my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
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