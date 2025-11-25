import {Badge} from "../../components/common/Badge.jsx";
import {Modal} from "../../components/common/Modal.jsx";
import React, {useCallback, useEffect, useState} from "react";
import {adminService, clientService} from "../../services/api.js";
import OrderStatusModal from "./OrderStatusModal.jsx";
import {ORDER_STATE_COLORS, ORDER_STATE_LABELS} from "../../utils/StringUtils.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import toast from "react-hot-toast";
import { useConfirm } from "../../contexts/UseConfirm.jsx";


export const OrderDetailModal = ({
                                     isOpen,
                                     onClose,
                                     order,
                                     onOrderUpdated
                                 }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useAuth();
    const [isCancelling, setIsCancelling] = useState(false);
    const confirm = useConfirm();
    const isClient = user?.role === 'CLIENT';
    // Memoize the load function to prevent unnecessary recreations
    const loadSelectedOrder = useCallback(async () => {
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

    const handleCancelOrder = useCallback(async () => {
        if (!selectedOrder?.id) return;

        // Confirmación con modal personalizado
        const confirmed = await confirm({
            title: "Cancelar pedido",
            message: "¿Estás seguro que deseas cancelar este pedido? Esta acción no se puede deshacer.",
            acceptText: "Cancelar pedido",
            cancelText: "Volver",
            type: "danger"
        });

        if (!confirmed) return;

        setIsCancelling(true);
        try {
            await clientService.cancelOrder(selectedOrder.id);

            // Recargar el pedido completo desde el backend
            const response = await adminService.getOrder(selectedOrder.id);
            setSelectedOrder(response);

            // Notificar al componente padre para actualizar la lista
            onOrderUpdated?.(response);

            toast.success('Pedido cancelado exitosamente');
        } catch (err) {
            console.error('Error cancelando pedido:', err);
            toast.error(err.message || 'No se pudo cancelar el pedido');
        } finally {
            setIsCancelling(false);
        }
    }, [selectedOrder?.id, confirm, onOrderUpdated]);

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
                        <h4 className="font-semibold text-gray-900 mb-2">Estado</h4>
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
                            {selectedOrder.dateCreated
                                ? new Date(selectedOrder.dateCreated).toLocaleString('es-UY', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : 'N/A'
                            }
                        </p>
                    </div>

                    {/* Creaciones */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Creaciones</h4>
                        {selectedOrder.creations?.length > 0 ? (
                            <div className="space-y-3">
                                {selectedOrder.creations.map((c, idx) => {
                                    const isExtra = c.creation?.type === 'EXTRA';

                                    return (
                                        <div
                                            key={c.creation?.id || idx}
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
                                                                {c.creation.products.map((p, pIdx) => (
                                                                    <li
                                                                        key={p.product?.id || pIdx}
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
                            <div className="flex justify-between items-center gap-3">
                                <h4 className="font-semibold text-gray-900 text-lg">Total</h4>
                                <p className="font-bold text-xl text-gray-900">
                                    ${selectedOrder.totalPrice}
                                </p>
                            </div>
                            {selectedOrder.state === 'CANCELLED' && (
                                <p className="text-sm text-gray-600 text-right mt-1">
                                    (Pedido cancelado - No se realizó el cobro)
                                </p>
                            )}
                        </div>
                    )}
                    {/* Botón de cancelar - Solo visible para clientes en estado IN_QUEUE */}
                    {isClient && selectedOrder?.state === 'IN_QUEUE' && (
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-wait transition-colors"
                            >
                                {isCancelling ? 'Cancelando...' : 'Cancelar Pedido'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};