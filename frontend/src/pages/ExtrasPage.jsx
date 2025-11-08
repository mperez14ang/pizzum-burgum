import React, { useEffect, useRef, useState } from 'react';
import {ArrowRight, ChevronLeft, ShoppingCart} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { ExtrasCard } from '../components/ExtrasCard';
import { useAuth } from '../contexts/AuthContext';
import { cartService, ingredientsService } from '../services/api';
import toast from 'react-hot-toast';
import {handleAddExtrasToCart, handleAddToCart} from "../utils/CartInteraction.jsx";
import {useCart} from "../contexts/CartContext.jsx";
import {getImage} from "../utils/StringUtils.jsx";

const CATEGORY_NAMES = {
    BEBIDA: 'Bebidas',
    POSTRE: 'Postres',
    ACOMPANAMIENTO: 'Acompañamientos',
    OTROS: 'Otros'
};

const MAX_QUANTITY_PER_EXTRA = 10;

export const ExtrasPage = ({ onNavigate, onBack }) => {
    const { isAuthenticated, user } = useAuth();
    const { itemCount, setCartItemCount } = useCart();

    const [extras, setExtras] = useState({
        BEBIDA: [],
        POSTRE: [],
        ACOMPANAMIENTO: [],
        OTROS: []
    });
    const [selectedExtras, setSelectedExtras] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCartLoginPrompt, setShowCartLoginPrompt] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Cargar extras desde el backend
    useEffect(() => {
        const loadExtras = async () => {
            try {
                setLoading(true);
                setError(null);

                const groupedExtras = await ingredientsService.getAllExtrasGrouped();

                setExtras({
                    BEBIDA: groupedExtras.BEBIDA,
                    POSTRE: groupedExtras.POSTRE,
                    ACOMPANAMIENTO: groupedExtras.ACOMPANAMIENTO ,
                    OTROS: groupedExtras.OTROS
                });
            } catch (err) {
                setError('Error al cargar los extras. Por favor, intenta de nuevo.');
                console.error('Error loading extras:', err);
            } finally {
                setLoading(false);
            }
        };

        loadExtras();
    }, []);

    // Manejar cambio de cantidad
    const handleQuantityChange = (extraId, quantity) => {
        setSelectedExtras(prev => {
            const newSelected = { ...prev };
            if (quantity === 0) {
                delete newSelected[extraId];
            } else {
                newSelected[extraId] = quantity;
            }
            return newSelected;
        });
    };

    // Calcular total
    const calculateTotal = () => {
        let total = 0;
        Object.entries(selectedExtras).forEach(([extraId, quantity]) => {
            const extra = Object.values(extras)
                .flat()
                .find(e => e.id === parseInt(extraId));
            if (extra) {
                total += extra.price * quantity;
            }
        });
        return total;
    };

    // Obtener items seleccionados para el resumen
    const getSelectedItems = () => {
        const items = [];
        Object.entries(selectedExtras).forEach(([extraId, quantity]) => {
            const extra = Object.values(extras)
                .flat()
                .find(e => e.id === parseInt(extraId));
            if (extra) {
                items.push({ ...extra, quantity });
            }
        });
        return items;
    };

    // ✅ Agregar extras al carrito
    const handleAddExtrasToCart = async () => {
        // Verificar autenticación
        if (!isAuthenticated) {
            setShowCartLoginPrompt(true);
            return;
        }

        // Verificar que haya extras seleccionados
        const selectedItems = getSelectedItems();
        if (selectedItems.length === 0) {
            toast.error('Por favor selecciona al menos un extra');
            return;
        }

        setIsAddingToCart(true);

        try {
            // Agregar cada extra al carrito
            let addedCount = 0;

            for (const item of selectedItems) {
                const extraData = {
                    extraId: item.id,
                    quantity: item.quantity
                };

                const result = await cartService.addExtraToCart(extraData);

                if (result) {
                    addedCount += item.quantity;
                }
            }

            if (addedCount > 0) {
                // Actualizar el contador del carrito
                setCartItemCount(itemCount + addedCount);

                toast.success(`${addedCount} extra(s) agregado(s) al carrito!`, { duration: 2000 });

                // Limpiar selecciones
                setSelectedExtras({});

                // Navegar al checkout
                onNavigate('checkout');
            } else {
                toast.error('No se pudieron agregar los extras al carrito');
            }
        } catch (error) {
            console.error('Error adding extras to cart:', error);
            toast.error('Error al agregar extras al carrito');
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando extras...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalItems = Object.values(selectedExtras).reduce((sum, qty) => sum + qty, 0);
    const total = calculateTotal();
    const selectedItems = getSelectedItems();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ChevronLeft size={20} />
                    <span className="ml-1">Volver</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de extras */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <h2 className="text-2xl font-bold">
                                    Agrega Extras a tu Pedido
                                </h2>
                            </CardHeader>

                            <CardBody>
                                <div className="space-y-8">
                                    {Object.entries(extras).map(([category, items]) => (
                                        items.length > 0 && (
                                            <div key={category}>
                                                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                                                    {CATEGORY_NAMES[category]}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {items.map(extra => (
                                                        <ExtrasCard
                                                            key={extra.id}
                                                            extra={extra}
                                                            onQuantityChange={handleQuantityChange}
                                                            maxQuantity={MAX_QUANTITY_PER_EXTRA}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Panel de resumen */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <h3 className="text-xl font-bold">Resumen</h3>
                            </CardHeader>

                            <CardBody>
                                {selectedItems.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
                                        <p>No hay extras seleccionados</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Items seleccionados */}
                                        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                            {selectedItems.map(item => (
                                                <div key={item.id} className="flex justify-between items-start border-b pb-2">
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Cantidad: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-orange-600">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="border-t pt-4 mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                                                <span className="font-semibold">${total.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-lg font-bold">
                                                <span>Total</span>
                                                <span className="text-orange-600">${total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Botón agregar al carrito */}
                                        <button
                                            onClick={() => handleAddExtrasToCart(selectedItems)}
                                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Finalizar Compra
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modales de autenticación */}
            <AddToCartModalLogin
                isOpen={showCartLoginPrompt}
                onOpenLogin={() => {
                    setShowCartLoginPrompt(false);
                    setIsAuthModalOpen(true);
                }}
                onClose={() => setShowCartLoginPrompt(false)}
            />

            <LoginAndRegisterModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
};