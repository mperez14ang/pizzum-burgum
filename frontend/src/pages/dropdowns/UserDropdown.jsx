import React, {useEffect, useRef} from 'react';
import { ChevronDown, CreditCard, History, LogOut, MapPin, Star, User, UserCircle } from 'lucide-react';
import toast from "react-hot-toast";

const UserDropdown = ({
                      isOpen,
                      onToggle,
                      onClose,
                      isAuthenticated,
                      user,
                      handleLogout,
                      onOpenLogin,
                      onNavigate,
                      handleClickOutside
                  }) => {
    const dropdownRef = useRef(null);

    // Cerrar modal al clickear afuera
    useEffect(() => {
        const handleClick = (event) => handleClickOutside(event, dropdownRef, onClose);

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    const handleMenuItemClick = (action) => {
        onClose();

        switch (action){
            case "Historial de Pedidos":
                onNavigate('orders')
                break
            case "Mi Perfil":
                onNavigate('profile')
                break
            case "Mis Favoritos":
                onNavigate('favorites')
                break
            default:
                {
                    // TODO: Implementar navegación a las páginas correspondientes
                    toast.error(`Función "${action}" pendiente de implementar`, { duration: 2000 });
                }
        }
    };

    const handleLogoutClick = () => {
        onClose();
        handleLogout();
    };

    if (!isAuthenticated) {
        return (
            <button
                onClick={onOpenLogin}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Iniciar sesión"
            >
                <User className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <span className="text-sm font-medium text-gray-700">
                    {user?.firstName || user?.email}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
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
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;