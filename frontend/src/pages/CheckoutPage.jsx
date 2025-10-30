import React, {useEffect, useRef, useState} from 'react';
import {ChevronLeft, CreditCard, MapPin, Minus, Plus, User} from 'lucide-react';
import toast from 'react-hot-toast';
import {cartService} from "../services/api.js";
import {Header} from "../components/common/header.jsx";
import {useAuth} from "../contexts/AuthContext.jsx";
import {capitalize} from "../utils/StringUtils.jsx";
import {AddressComponent} from "../components/AddressComponent.jsx";
import {CardComponent} from "../components/CardComponent.jsx";
import {cartInteraction, cartItemCount, cartSubtotal, updateQuantity} from "../utils/CartInteraction.jsx";
import CardModal from "./modals/CardModal.jsx";
import {AddAddressModal} from "./modals/AddAddressModal.jsx";
import {useCards} from "../contexts/UseCards.jsx";
import {useAddresses} from "../contexts/UseAddresses.jsx";

export const CheckoutPage = ({ onNavigate, onBack }) => {
    const { user, isAuthenticated } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const debounceTimers = useRef({});
    const [showCardModal, setShowCardModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const itemCount = cartItemCount(cartItems);
    const subtotal = cartSubtotal(cartItems);

    const calculateDelivery = () => {return 50; };
    const total = subtotal + calculateDelivery();

    const { cards, isLoadingCards, getCards, handleCreateCard } = useCards();
    const { addresses, isLoadingAddresses, getAddresses, handleCreateAddress } = useAddresses();

    // Datos del formulario
    const [formData, setFormData] = useState({
        orderNotes: ''
    });

    useEffect(() => {
        // No hacer nada si no está abierto o no está autenticado
        if (!isAuthenticated) return;

        cartInteraction({setLoading, setError, setCartItems}).then(r => {});
        getAddresses();
        getCards();
    }, [isAuthenticated]);


    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo
        if (error[name]) {
            setError(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Procesar pedido
    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        try {

            // TODO: Aqui iria el procesamiento del pedido

            // Limpiar carrito
            await cartService.clearCart();

            toast.loading('Falta implementar pedido', { duration: 3000 });

            // TODO: Aqui la idea seria que llevase al usuario a una pagina donde pueda ver el estado de su pedido
            onNavigate('home');
        } catch (error) {
            console.error('Error processing order:', error);
            toast.error('Error al procesar el pedido. Intenta nuevamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateAddressSubmit = async (addressData) => {
        const success = await handleCreateAddress(addressData, user);
        if (success) {
            setShowAddressModal(false);
            getAddresses()
        }
    };

    const handleCreateCardSubmit = async (cardData) => {
        const success = await handleCreateCard(cardData, user);
        if (success) {
            setShowCardModal(false);
            getCards()
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header onNavigate={onNavigate} />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando checkout...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate} />

            <div className="container mx-auto px-4 py-6">
                {/* Botón volver */}
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ChevronLeft size={20} />
                    <span className="ml-1">Volver</span>
                </button>

                <h1 className="text-3xl font-bold mb-6">Finalizar Pedido</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario de checkout */}
                    <div className="lg:col-span-2">
                        <form className="space-y-6">
                            {/* Datos personales */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <User size={24} className="text-orange-500" />
                                    Datos Personales
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Nombre completo
                                        </label>
                                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <p className="text-gray-900 font-medium">{capitalize(user.firstName) + ' ' + capitalize(user.lastName) || 'No disponible'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Email
                                        </label>
                                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <p className="text-gray-900 font-medium">{user.email || 'No disponible'}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Dirección de entrega */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <MapPin size={24} className="text-orange-500" />
                                    Dirección de Entrega
                                </h2>

                                <AddressComponent user={user}
                                                  addresses={addresses}
                                                  hasTitle={false}
                                                  onOpenCreateAddress={() => setShowAddressModal(true)} />
                            </div>

                            {/* Metodo de pago */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <CreditCard size={24} className="text-orange-500" />
                                    Método de Pago
                                </h2>

                                <CardComponent cards={cards} hasTitle={false} onOpenCreateCard={() => setShowCardModal(true)}/>
                            </div>

                            {/* Notas del pedido */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4">Notas adicionales</h2>
                                <textarea
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Ej: Sin cebolla, extra salsa picante..."
                                />
                            </div>
                        </form>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                            {/* Items del carrito */}
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 pb-4 border-b">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                                            <img
                                                src={item.image ? `http://localhost:8080${item.image}` : '/placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm">{item.name}</h3>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {item.type === 'PIZZA' ? 'Pizza' : 'Hamburguesa'}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, cartItems, setCartItems, debounceTimers)}
                                                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, cartItems, setCartItems, debounceTimers)}
                                                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="font-semibold text-orange-500">
                                                    ${item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totales */}
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span>Elementos:</span>
                                    <span className="font-medium">{itemCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">${subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Envío:</span>
                                    <span className="font-medium">${calculateDelivery()}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-orange-500">${total}</span>
                                </div>
                            </div>

                            {/* Botón de confirmar pedido */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={submitting}
                                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        <span>Confirmar Pedido</span>
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                🔒 Pago seguro. Tus datos están protegidos.
                            </p>

                            {/* Tiempo estimado de entrega */}
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800 font-medium">
                                    ⏱️ Tiempo estimado de entrega: 30-45 minutos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CardModal isOpen={showCardModal} onClose={() => setShowCardModal(false)} onSave={handleCreateCardSubmit} />
            <AddAddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} onSave={handleCreateAddressSubmit} />
        </div>
    );
};