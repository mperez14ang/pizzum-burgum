import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import toast, { Toaster } from 'react-hot-toast';

export const Header = () => {
    const { user, isAuthenticated, login, logout } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            const result = await login(loginData.email, loginData.password);

            if (result.success) {
                toast.success('Sesión iniciada correctamente');
                setIsLoginModalOpen(false);
                setLoginData({ email: '', password: '' });
            } else {
                toast.error(result.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            toast.error('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Sesión cerrada');
    };

    return (
        <>
            <Toaster position="top-right" />
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
                                    onClick={() => setIsLoginModalOpen(true)}
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

            {/* Login Modal */}
            <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                title="Iniciar Sesión"
            >
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="tu@email.com"
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="••••••••"
                    />

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsLoginModalOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};