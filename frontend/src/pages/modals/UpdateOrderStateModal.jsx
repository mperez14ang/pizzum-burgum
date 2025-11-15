import {Modal} from "../../components/common/Modal.jsx";
import {Select} from "../../components/common/Select.jsx";
import {Button} from "../../components/common/Button.jsx";

export const UpdateOrderStateModal = (
    {isOpen, onClose, onSubmit, selectedOrder, orderStates, newState, setNewState, updating, ORDER_STATE_LABELS}) => {
    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Actualizar Estado del Pedido"
    >
        {selectedOrder && (
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-600 mb-2">
                        Estado actual: <strong>{ORDER_STATE_LABELS[selectedOrder.state]}</strong>
                    </p>
                    <Select
                        label="Nuevo estado"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        options={orderStates
                            .filter(state => state !== 'UNPAID')
                            .map(state => ({
                                value: state,
                                label: ORDER_STATE_LABELS[state] || state
                            }))}
                    />
                </div>
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={updating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onSubmit}
                        disabled={updating}
                    >
                        {updating ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                </div>
            </div>
        )}
    </Modal>
}