import {useAuth} from '../../contexts/AuthContext';
import {forwardRef, useEffect, useRef, useState} from 'react';
import toast from 'react-hot-toast';
import {LoginAndRegisterModal} from "../../pages/modals/LoginAndRegisterModal.jsx";
import UserDropdown from "../../pages/dropdowns/UserDropdown.jsx";
import CartDropdown from "../../pages/dropdowns/CartDropdown.jsx";

export const Header = forwardRef(({onNavigate}, ref) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false)
    const dropdownRef = useRef(null);

    // Cerrar modal despues de autenticarse
    useEffect(() => {
        if (isAuthenticated) {
            setIsAuthModalOpen(false);
            setIsCartOpen(false);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        toast.success('Sesión cerrada', { duration: 2000 });
        // After logging out, navigate to Home page
        if (onNavigate) {
            onNavigate('home');
        }
    };

    const onToggleCart = () => {
        setIsCartOpen(!isCartOpen)
        setIsDropdownOpen(false);
    }

    const onToggleUser = () => {
        setIsDropdownOpen(!isDropdownOpen)
        setIsCartOpen(false);
    }

    const handleClickOutside = (event, dropdownRef, onClose) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            onClose()
        }
    };

    const handleCheckout = () => {
        setIsCartOpen(false)
        onNavigate('checkout')
    }

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1
                            onClick={() => onNavigate('home')}
                            className="text-2xl font-bold text-gray-900 cursor-pointer">
                            PizzUM & BurgUM
                        </h1>
                        <div className="flex gap-4 items-center">
                            <CartDropdown isOpen={isCartOpen}
                                          onToggle={onToggleCart}
                                          onClose={() => setIsCartOpen(false)}
                                          handleClickOutside={handleClickOutside}
                                          onCheckout={handleCheckout}
                            />

                            <UserDropdown isOpen={isDropdownOpen}
                                          onToggle={onToggleUser}
                                          onClose={() => setIsDropdownOpen(false)}
                                          user={user}
                                          isAuthenticated={isAuthenticated}
                                          handleLogout={handleLogout}
                                          onOpenLogin={() => setIsAuthModalOpen(true)}
                                          onNavigate={onNavigate}
                                          handleClickOutside={handleClickOutside}/>
                        </div>

                    </div>
                </div>
            </header>

            {/* Login & Register Modal */}
            <LoginAndRegisterModal
                isOpen={!isAuthenticated && isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}></LoginAndRegisterModal>
        </>
    );
});

Header.displayName = 'Header';