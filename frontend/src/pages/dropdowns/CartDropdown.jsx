import React, {useEffect, useRef, useState} from 'react';
import {ArrowRight, Minus, Plus, ShoppingBag, Trash2, X} from 'lucide-react';

const CartDropdown = (
    {isOpen, onToggle, onClose, handleClickOutside}
    ) => {
    /**
     *             id: 2,
     *             name: 'Hamburguesa',
     *             price: 89.99,
     *             quantity: 1,
     *             image: null,
     * **/
    const [cartItems, setCartItems] = useState([]);

    const dropdownRef = useRef(null);

    // Cerrar modal al clickear afuera
    useEffect(() => {
        const handleClick = (event) => handleClickOutside(event, dropdownRef, onClose);

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    const updateQuantity = (id, change) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 rounded-full">
                <ShoppingBag className="w-6 h-6" />
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
            </button>

            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Carrito ({itemCount})
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {cartItems.length === 0? (
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
                            {/* Items del carrito */}
                            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        {/* Imagen */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                        />

                                        {/* Info */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Cantidad */}
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {/* Precio */}
                                                <span className="text-sm font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer - Fixed */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                {/* Subtotal */}
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="text-xl font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-2">
                                    <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center gap-2">
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
        </div>
        </div>
    );
};

export default CartDropdown;