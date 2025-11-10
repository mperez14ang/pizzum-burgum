import React, {useEffect, useRef, useState} from 'react';
import {ArrowRight, Minus, Plus, ShoppingBag, Trash2, X} from 'lucide-react';
import {useAuth} from "../../contexts/AuthContext.jsx";
import {LoginAndRegisterModal} from "../modals/LoginAndRegisterModal.jsx";
import {
    cartInteraction,
    cartItemCount,
    cartSubtotal,
    removeItem,
    updateQuantity
} from "../../utils/CartInteraction.jsx";
import {useCart} from "../../contexts/CartContext.jsx";
import {getImage} from "../../utils/StringUtils.jsx";

const CartDropdown = ({ isOpen, onToggle, onClose, handleClickOutside, onCheckout, onGoToExtras }) => {
    const { cartItems, setCartItems, itemCount, setCartItemCount } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoginModals, setIsLoginModals] = useState(null)
    const {isAuthenticated} = useAuth();
    const debounceTimers = useRef({});

    const dropdownRef = useRef(null);

    // Cerrar modal al clickear afuera
    useEffect(() => {
        const handleClick = (event) => handleClickOutside(event, dropdownRef, onClose);
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose, handleClickOutside]);

    // Obtener carrito cuando se abre el dropdown (solo si está autenticado)
    useEffect(() => {
        if (!isOpen || !isAuthenticated) return;

        cartInteraction({ setLoading, setCartItems, setError }).then((res) => {
            // actualizar itemCount al cargar el carrito
            const count = cartItemCount(res || []);
            setCartItemCount(count)
        });
    }, [isOpen, isAuthenticated]);

    // Resetear si el usuario se desautentica
    useEffect(() => {
        if (!isAuthenticated) {
            setCartItems([]);
            setCartItemCount(0)
        }
    }, [isAuthenticated]);

    // Sincronizar itemCount con localStorage cuando cambie el carrito
    useEffect(() => {
        setCartItemCount(cartItemCount(cartItems))
    }, [cartItems]);

    const subtotal = cartSubtotal(cartItems);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-full relative">
                <ShoppingBag className="w-6 h-6" />
                {isAuthenticated && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-x-4 top-16 sm:absolute sm:right-0 sm:left-auto sm:top-auto mt-2 w-auto sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] sm:max-h-[600px] flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Carrito {isAuthenticated && `(${itemCount})`}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!isAuthenticated ? (
                        <div className="px-6 py-12 text-center">
                            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-700 font-semibold mb-2">Inicia sesión para ver tu carrito</p>
                            <p className="text-gray-500 text-sm mb-6">Accede a tu cuenta para gestionar tus productos</p>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setIsLoginModals(true)}
                                    className="w-full px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                                >
                                    Continuar Navegando
                                </button>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="px-6 py-12 text-center text-gray-500">Cargando carrito...</div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center text-red-500">{error}</div>
                    ) : cartItems.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <img
                                            src={getImage(item,item.type, item.extraType)}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                                                <button
                                                    onClick={() => removeItem(item.id, cartItems, setCartItems)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, cartItems, setCartItems, debounceTimers)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, cartItems, setCartItems, debounceTimers)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="text-xl font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="space-y-2">
                                    <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center gap-2"
                                    onClick={onGoToExtras}>
                                        Finalizar Compra
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-white text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 text-sm"
                                    >
                                        Seguir Comprando
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            {/* Login & Register Modal */}
            <LoginAndRegisterModal
                isOpen={!isAuthenticated && isLoginModals}
                onClose={() => setIsLoginModals(false)}></LoginAndRegisterModal>
        </div>
    );
};

export default CartDropdown;