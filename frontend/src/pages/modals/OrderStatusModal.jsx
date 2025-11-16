import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal.jsx';
import {UseOrderWebSocket} from "../../contexts/UseOrderWebSocket.jsx";

export const OrderStatusModal = ({
                                     isOpen,
                                     onClose,
                                     order,
                                     onOrderUpdated,
                                     title = 'Estado del pedido',
                                     drawAsComponent = false
                                 }) => {
    const LABELS = ['Pago', 'En cola', 'En preparación', 'En camino', 'Entregado'];
    const [localOrder, setLocalOrder] = useState(order);

    const { isConnected, error } = UseOrderWebSocket(
        order?.id,
        (update) => {
            console.log("Subscribing")
            // Actualizar orden cuando llega una actualización
            if (update.orderId === order?.id) {
                const updatedOrder = { ...localOrder, state: update.state };
                setLocalOrder(updatedOrder);

                if (typeof onOrderUpdated === 'function') {
                    onOrderUpdated(updatedOrder);
                }
            }
        },
        isOpen // Solo conectar cuando el modal está abierto
    );

    // Sincronizar con la orden externa
    useEffect(() => {
        if (order) {
            setLocalOrder(order);
        }
    }, [order]);

    const stateToIndex = (state) => {
        if (!state) return -1;
        const s = String(state).toUpperCase();
        if (s === 'CANCELLED') return 'CANCELLED';
        if (s === 'UNPAID') return -1;
        if (s === 'IN_QUEUE') return 1;
        if (s === 'MAKING') return 2;
        if (s === 'DELIVERING') return 3;
        if (s === 'DELIVERED') return 4;
        return 0;
    };

    const currentIndex = useMemo(() => {
        const src = localOrder || order;
        if (!src) return -1;
        const val = stateToIndex(src?.state);
        if (val === 'CANCELLED') return 'CANCELLED';
        if (val >= 0) return val;
        return -1;
    }, [localOrder, order]);

    const tickPositions = useMemo(() => {
        const d = 100 / 3.5;
        return [
            0,
            d / 2,
            d / 2 + d,
            d / 2 + 2 * d,
            d / 2 + 3 * d
        ];
    }, []);

    const fillPercent = useMemo(() => {
        if (currentIndex === 'CANCELLED') return 100;
        if (currentIndex == null || currentIndex < 0) return 0;
        return tickPositions[Math.min(currentIndex, tickPositions.length - 1)];
    }, [currentIndex, tickPositions]);

    const cancelled = currentIndex === 'CANCELLED';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg" drawAsComponent={drawAsComponent}>
            {!order ? (
                <div className="text-gray-600">No se encontró información del pedido.</div>
            ) : (
                <div className="px-2 sm:px-4 min-w-[340px]">
                {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Pedido #{order?.id}  {/* ← Usar solo el ID */}
                        </div>

                        {/* Indicador de conexión */}
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                                isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`} />
                            <span className="text-xs text-gray-500">{isConnected ? 'Tiempo real' : 'Desconectado'}</span>
                        </div>
                    </div>

                    {/* Error de conexión */}
                    {error && (
                        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            ⚠️ Reconectando...
                        </div>
                    )}

                    {/* Progress bar */}
                    <div className="w-full">
                        {cancelled ? (
                            <div className="text-center">
                                <div className="relative h-3 w-full bg-red-500 rounded-full" />
                                <div className="mt-3 text-red-600 font-semibold">Cancelado! :(</div>
                            </div>
                        ) : (
                            <div>
                                <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-visible">
                                    <div
                                        className="h-3 bg-green-500 rounded-full transition-all duration-500"
                                        style={{ width: `${fillPercent}%` }}
                                    />

                                    {tickPositions.map((pos, idx) => (
                                        <div
                                            key={idx}
                                            className="absolute top-1/2 -translate-y-1/2"
                                            style={{ left: `calc(${pos}% - 1px)` }}
                                        >
                                            <div className="w-0.5 h-5 bg-gray-400 translate-y-[-6px]" />
                                        </div>
                                    ))}
                                </div>

                                <div className="relative mt-4">
                                    {LABELS.map((label, idx) => (
                                        <div
                                            key={label}
                                            className="absolute -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap px-1 text-center"
                                            style={{ left: `${tickPositions[idx]}%` }}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-end px-2 sm:px-4" />
        </Modal>
    );
};

export default OrderStatusModal;