import {useEffect, useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {LogOut, Menu, Package, ShoppingBag, User, Users, X, BadgeInfoIcon} from 'lucide-react';

export function AdminLayout({ children, currentSection = 'orders', onSectionChange = () => {} }) {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    const menuItems = [
        { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'profile', label: 'Mi Perfil', icon: User },
        {
            id: 'manual',
            label: 'Manual de uso',
            icon: BadgeInfoIcon,
            href: 'https://docs.google.com/document/d/194K-ZeOnpR5dyv2OgXGg8LqtFSZ-yIaU-nG49bQXmGs/edit?usp=sharing'
        }
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm flex-shrink-0 z-40">
                <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Panel de Administrador</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:transform-none ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } flex flex-col overflow-hidden`}
                >
                    <nav className="flex-1 p-4 pt-20 lg:pt-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentSection === item.id;

                            // Definimos las clases comunes para que se vean idénticos
                            const commonClasses = `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`;

                            // Si tiene href, es un link externo (<a>)
                            if (item.href) {
                                return (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={commonClasses}
                                        onClick={() => setIsSidebarOpen(false)} // Cierra menú en móvil
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </a>
                                );
                            }

                            // Si NO tiene href, es un botón de navegación interna (<button>)
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSectionChange(item.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={commonClasses}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    ></div>
                )}

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}