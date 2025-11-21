import {Badge} from "../../components/common/Badge.jsx";
import {Modal} from "../../components/common/Modal.jsx";
import React, {useCallback, useEffect, useState} from "react";
import {adminService, clientService} from "../../services/api.js";
import OrderStatusModal from "./OrderStatusModal.jsx";
import {ORDER_STATE_COLORS, ORDER_STATE_LABELS} from "../../utils/StringUtils.jsx";
import {X} from "lucide-react";

export const OrderDetailModal = ({
                                     isOpen,
                                     onClose,
                                     order,
                                     onOrderUpdated
                                 }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cancel modal state
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [canceling, setCanceling] = useState(false);

    // Memoize the load function to prevent unnecessary recreations
    const loadSelectedOrder = useCallback(async () => {
        console.log(order)
        if (!order?.id) return;

        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getOrder(order.id);
            setSelectedOrder(response);
        } catch (err) {
            console.error('Error loading order:', err);
            setError('No se pudo cargar el pedido. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }, [order?.id]);

    useEffect(() => {
        if (isOpen) {
            setSelectedOrder(null);
            setError(null);
            loadSelectedOrder();
        }
    }, [isOpen, order?.id, loadSelectedOrder]);

    // Handle order updates
    const handleOrderUpdated = useCallback((updatedOrder) => {
        setSelectedOrder(updatedOrder);
        onOrderUpdated?.(updatedOrder);
        order.state = updatedOrder.state;
    }, [onOrderUpdated]);

    // Calculate total price
    const calculateTotal = () => {
        if (!selectedOrder?.creations) return 0;
        return selectedOrder.creations.reduce((total, c) => {
            return total + (c?.price || 0) * c.quantity;
        }, 0);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder?.id) return;

        setCanceling(true);
        try {
            const response = await clientService.cancelOrder(selectedOrder.id);

            // Actualizar el pedido seleccionado con el nuevo estado
            const updatedOrder = { ...selectedOrder, state: 'CANCELLED' };
            setSelectedOrder(updatedOrder);

            // Notificar al componente padre para actualizar la lista
            onOrderUpdated?.(updatedOrder);

            setIsCancelModalOpen(false);
        } catch (error) {
            alert(error?.message || 'Error al cancelar el pedido');
        } finally {
            setCanceling(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={selectedOrder ? `Detalle del Pedido #${selectedOrder.id}` : 'Detalle del Pedido'}
            size="lg"
            loading={loading}
        >
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                    <button
                        onClick={loadSelectedOrder}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {selectedOrder && (
                <div className="space-y-6">
                    {/* Estado */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">Estado</h4>
                            {selectedOrder.state === 'IN_QUEUE' && (
                                <button
                                    onClick={() => setIsCancelModalOpen(true)}
                                    className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition"
                                >
                                    Cancelar pedido
                                </button>
                            )}
                        </div>
                        <Badge variant={ORDER_STATE_COLORS[selectedOrder.state]}>
                            {ORDER_STATE_LABELS[selectedOrder.state] || selectedOrder.state}
                        </Badge>
                        <OrderStatusModal
                            isOpen={isOpen}
                            onClose={onClose}
                            order={selectedOrder}
                            title="Estado del pedido"
                            onOrderUpdated={handleOrderUpdated}
                            drawAsComponent={true}
                        />
                    </div>

                    {/* Información del Cliente */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cliente</h4>
                        <p className="text-gray-600">{selectedOrder.clientEmail || 'N/A'}</p>
                    </div>

                    {/* Dirección de Entrega */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Dirección de entrega</h4>
                        {selectedOrder.deliveryStreet ? (
                            <p className="text-gray-600">
                                {selectedOrder.deliveryStreet}
                                {selectedOrder.deliveryCity && `, ${selectedOrder.deliveryCity}`}
                                {selectedOrder.deliveryPostalCode && ` (CP: ${selectedOrder.deliveryPostalCode})`}
                            </p>
                        ) : (
                            <p className="text-gray-600">N/A</p>
                        )}
                    </div>

                    {/* Fecha de pedido */}
                    <div className="font-semibold text-gray-900 mb-2">
                        <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-gray-900">Fecha de creación</h4>
                        </div>
                        <p className="text-gray-700 font-medium">
                            {selectedOrder.dateCreated.split('-').reverse().join('/')}
                        </p>
                    </div>

                    {/* Creaciones */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Creaciones</h4>
                        {selectedOrder.creations?.length > 0 ? (
                            <div className="space-y-3">
                                {selectedOrder.creations.map((c) => {
                                    const isExtra = c.creation?.type === 'EXTRA';

                                    return (
                                        <div
                                            key={c.id}
                                            className="border rounded-xl p-4 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {isExtra ? (
                                                // Mostrar como producto simple
                                                <>
                                                    <div className="flex justify-between items-center">
                                                        <h5 className="font-semibold text-gray-900">
                                                            {c.creation?.name || 'Sin nombre'}
                                                        </h5>
                                                        <Badge variant="outline">x{c.quantity}</Badge>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                                                        <span className="text-gray-500">Extra</span>
                                                        <span className="font-medium">${c?.price || 0} × {c.quantity} = ${(c?.price || 0) * c.quantity}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                // Mostrar como creación con productos
                                                <>
                                                    {/* Nombre + Cantidad */}
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h5 className="font-semibold text-gray-900">
                                                            {c.creation?.name || 'Sin nombre'}
                                                        </h5>
                                                        <Badge variant="outline">x{c.quantity}</Badge>
                                                    </div>

                                                    {/* Tipo y Precio */}
                                                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                                                        <span>Tipo: {c.creation?.type || 'N/A'}</span>
                                                        <span className="font-medium">
                                        Precio: ${c?.price || 0} × {c.quantity} = ${(c?.price || 0) * c.quantity}
                                    </span>
                                                    </div>

                                                    {/* Productos */}
                                                    {c.creation?.products?.length > 0 && (
                                                        <div className="mt-3 pl-3 border-l-2 border-gray-300">
                                                            <p className="font-medium text-gray-700 mb-2 text-sm">
                                                                Productos:
                                                            </p>
                                                            <ul className="space-y-1 text-sm">
                                                                {c.creation.products.map((p) => (
                                                                    <li
                                                                        key={p.id}
                                                                        className="flex justify-between text-gray-600"
                                                                    >
                                                    <span>
                                                        {p.product?.name || 'Sin nombre'}
                                                    </span>
                                                                        <span className="font-medium">x{p.quantity}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-600">No hay creaciones en este pedido</p>
                        )}
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center text-gray-800">
                            <h4 className="font-semibold">Delivery</h4>
                            <p className="font-medium">${selectedOrder.extraAmount}</p>
                        </div>
                    </div>

                    {/* Total */}
                    {selectedOrder.creations?.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-900 text-lg">Total</h4>
                                <p className="font-bold text-gray-900 text-xl">
                                    ${selectedOrder.totalPrice}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <X className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Cancelar pedido</h3>
                                    <p className="text-sm text-gray-500">Pedido #{selectedOrder?.id}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                disabled={canceling}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                No, volver
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={canceling}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {canceling ? 'Cancelando...' : 'Sí, cancelar pedido'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};