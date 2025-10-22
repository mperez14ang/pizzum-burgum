import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loading } from '../../components/common/Loading';
import { Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ORDER_STATE_COLORS = {
    UNPAID: 'warning',
    IN_QUEUE: 'info',
    MAKING: 'primary',
    DELIVERING: 'info',
    DELIVERED: 'success',
    CANCELLED: 'danger',
    ON_HOLD: 'warning'
};

const ORDER_STATE_LABELS = {
    UNPAID: 'Sin pagar',
    IN_QUEUE: 'En cola',
    MAKING: 'Preparando',
    DELIVERING: 'En camino',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
    ON_HOLD: 'En espera'
};

export const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stateFilter, setStateFilter] = useState('');
    const [orderStates, setOrderStates] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [newState, setNewState] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadOrders();
        loadOrderStates();
    }, []);

    useEffect(() => {
        if (stateFilter) {
            setFilteredOrders(orders.filter(order => order.state === stateFilter));
        } else {
            setFilteredOrders(orders);
        }
    }, [stateFilter, orders]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllOrders();
            // Sort by id descending (most recent first)
            const sortedData = data.sort((a, b) => b.id - a.id);
            setOrders(sortedData);
            setFilteredOrders(sortedData);
        } catch (error) {
            toast.error('Error al cargar pedidos', { duration: 2000 });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadOrderStates = async () => {
        try {
            const states = await adminService.getOrderStates();
            setOrderStates(states);
        } catch (error) {
            console.error('Error loading order states:', error);
        }
    };

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleUpdateState = (order) => {
        setSelectedOrder(order);
        setNewState(order.state);
        setIsUpdateModalOpen(true);
    };

    const submitUpdateState = async () => {
        if (!newState || newState === selectedOrder.state) {
            toast.error('Selecciona un estado diferente', { duration: 2000 });
            return;
        }

        try {
            setUpdating(true);
            await adminService.updateOrderState(selectedOrder.id, newState);
            toast.success('Estado actualizado correctamente', { duration: 2000 });
            setIsUpdateModalOpen(false);
            loadOrders();
        } catch (error) {
            toast.error('Error al actualizar estado', { duration: 2000 });
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loading size="lg" text="Cargando pedidos..." />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Pedidos</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="w-full sm:w-64">
                        <Select
                            placeholder="Todos los estados"
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            options={orderStates.map(state => ({
                                value: state,
                                label: ORDER_STATE_LABELS[state] || state
                            }))}
                        />
                    </div>
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredOrders.length} de {orders.length} pedidos
                    </p>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-500 py-8">No hay pedidos para mostrar</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredOrders.map((order) => (
                        <Card key={order.id}>
                            <CardBody>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Pedido #{order.id}
                                            </h3>
                                            <Badge variant={ORDER_STATE_COLORS[order.state]}>
                                                {ORDER_STATE_LABELS[order.state] || order.state}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>Cliente: {order.clientEmail}</p>
                                            <p>Dirección: {order.addressId}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewDetail(order)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Ver detalle
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleUpdateState(order)}
                                        >
                                            Cambiar estado
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
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

            {/* Update State Modal */}
            <Modal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
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
                                options={orderStates.map(state => ({
                                    value: state,
                                    label: ORDER_STATE_LABELS[state] || state
                                }))}
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setIsUpdateModalOpen(false)}
                                disabled={updating}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={submitUpdateState}
                                disabled={updating}
                            >
                                {updating ? 'Actualizando...' : 'Actualizar'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
