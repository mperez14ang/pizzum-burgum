import {Badge} from "../../components/common/Badge.jsx";
import {Modal} from "../../components/common/Modal.jsx";

export const OrderDetailModal = ({isOpen, onClose, selectedOrder, ORDER_STATE_COLORS, ORDER_STATE_LABELS}) => {
    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Detalle del Pedido #${selectedOrder?.id}`}
        size="lg"
    >
        {selectedOrder && (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Estado</h4>
                    <Badge variant={ORDER_STATE_COLORS[selectedOrder.state]}>
                        {ORDER_STATE_LABELS[selectedOrder.state] || selectedOrder.state}
                    </Badge>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cliente</h4>
                    <p className="text-gray-600">{selectedOrder.clientEmail}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dirección de entrega</h4>
                    <p className="text-gray-600">ID: {selectedOrder.addressId}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Creaciones</h4>
                    <p className="text-gray-600">IDs: {selectedOrder.creations?.join(', ') || 'N/A'}</p>
                </div>
            </div>
        )}
    </Modal>
}