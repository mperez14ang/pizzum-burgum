import {Badge} from "../../components/common/Badge.jsx";
import {Modal} from "../../components/common/Modal.jsx";
import {useEffect, useState} from "react";
import {adminService} from "../../services/api.js";

export const OrderDetailModal = ({isOpen, onClose, selectedOrderId, ORDER_STATE_COLORS, ORDER_STATE_LABELS}) => {
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadSelectedOrder = async () => {
            setLoading(true)
            console.log(selectedOrderId)
            const response = await adminService.getOrder(selectedOrderId)
            setSelectedOrder(response)
            setLoading(false)
        }
        if (isOpen){
            setSelectedOrder(null)
            loadSelectedOrder()
        }

    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detalle del Pedido #${selectedOrderId}`}
            size="lg"
            loading={loading}
        >
            {selectedOrder && (
                <div className="space-y-6">
                    {/* Estado */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Estado</h4>
                        <Badge variant={ORDER_STATE_COLORS[selectedOrder.state]}>
                            {ORDER_STATE_LABELS[selectedOrder.state] || selectedOrder.state}
                        </Badge>
                    </div>

                    {/* Cliente */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cliente</h4>
                        <p className="text-gray-600">{selectedOrder.clientEmail}</p>
                    </div>

                    {/* Dirección */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Dirección de entrega</h4>
                        <p className="text-gray-600">
                            {selectedOrder.deliveryStreet}, {selectedOrder.deliveryCity}{" "}
                            (CP: {selectedOrder.deliveryPostalCode})
                        </p>
                    </div>

                    {/* Creaciones */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Creaciones</h4>
                        {selectedOrder.creations && selectedOrder.creations.length > 0 ? (
                            <div className="space-y-3">
                                {selectedOrder.creations.map((c) => (
                                    <div
                                        key={c.id}
                                        className="border rounded-xl p-4 bg-gray-50 shadow-sm"
                                    >
                                        {/* Nombre + cantidad */}
                                        <div className="flex justify-between items-center mb-1">
                                            <h5 className="font-semibold text-gray-900">
                                                {c.creation?.name}
                                            </h5>
                                            <Badge variant="outline">x{c.quantity}</Badge>
                                        </div>

                                        {/* Tipo y precio */}
                                        <p className="text-sm text-gray-600">
                                            Tipo: {c.creation?.type} — Precio: ${c.creation?.price}
                                        </p>

                                        {/* Productos */}
                                        {c.creation?.products?.length > 0 && (
                                            <div className="mt-3 pl-3 border-l-2 border-gray-300">
                                                <p className="font-medium text-gray-700 mb-1 text-sm">
                                                    Productos:
                                                </p>
                                                <ul className="space-y-1 text-sm">
                                                    {c.creation.products.map((p) => (
                                                        <li
                                                            key={p.id}
                                                            className="flex justify-between text-gray-600"
                                                        >
                            <span>
                              {p["product"]?.name} ({p["product"]?.type})
                            </span>
                                                            <span>x{p.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">N/A</p>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );

}