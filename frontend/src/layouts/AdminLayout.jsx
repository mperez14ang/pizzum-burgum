import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, ShoppingBag, Package, Users, LogOut } from 'lucide-react';

export const AdminLayout = ({ children, currentSection, onSectionChange }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'admins', label: 'Administradores', icon: Users }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
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

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } h-[calc(100vh-57px)] lg:h-screen mt-[57px] lg:mt-0`}
                >
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSectionChange(item.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden mt-[57px]"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
