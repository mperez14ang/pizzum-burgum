import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Calendar, ChevronLeft, Clock, Filter as FilterIcon} from 'lucide-react';
import {clientService} from '../services/api.js';
import {useAuth} from '../contexts/AuthContext.jsx';
import {OrderStatusModal} from './modals/OrderStatusModal.jsx';
import {OrderDetailModal} from './modals/OrderDetailModal.jsx';
import {ORDER_STATE_LABELS} from "../utils/StringUtils.jsx";

export const OrderHistoryPage = ({ onNavigate, onBack }) => {
    const { user } = useAuth();

    const [filter, setFilter] = useState('hoy'); // 'hoy' | 'semana' | 'mes' | 'fecha'
    const [selectedDate, setSelectedDate] = useState(null); // yyyy-mm-dd

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modals state
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const dateInputRef = useRef(null);
    const detailsRef = useRef(null);

    const handleSelectFilter = (option) => {
        // Cerrar el dropdown si está abierto
        if (detailsRef.current && detailsRef.current.open) {
            detailsRef.current.open = false;
        }

        if (option === 'fecha') {
            setFilter('fecha');
            // Abrir selector nativo de fecha
            if (dateInputRef.current) {
                dateInputRef.current.showPicker?.();
                // Fallback para navegadores sin showPicker
                setTimeout(() => dateInputRef.current && dateInputRef.current.focus(), 0);
            }
            return;
        }
        setSelectedDate(null);
        setFilter(option);
    };

    const filterLabel = useMemo(() => {
        switch (filter) {
            case 'hoy':
                return 'Hoy';
            case 'semana':
                return 'Última semana';
            case 'mes':
                return 'Último mes';
            case 'fecha': {
                if (!selectedDate) return 'Por fecha';
                // Evitar desfase de un día por parsing como UTC en algunos navegadores
                // Forzar medianoche local al construir la fecha
                const safe = new Date(`${selectedDate}T00:00:00`);
                return safe.toLocaleDateString('es-UY');
            }
            default:
                return 'Filtrar';
        }
    }, [filter, selectedDate]);

    // Cargar y filtrar órdenes
    useEffect(() => {
        const loadOrders = async () => {
            if (!user?.email) return;
            setLoading(true);
            setError(null);
            try {
                // Traemos TODAS las órdenes y filtramos por cliente en el frontend
                const data = await clientService.getClientOrders();
                if (!Array.isArray(data)){
                    return
                }

                // Aplicar filtros de fecha
                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const sevenDaysAgo = new Date(startOfToday);
                sevenDaysAgo.setDate(startOfToday.getDate() - 6); // incluye hoy → 7 días
                const thirtyDaysAgo = new Date(startOfToday);
                thirtyDaysAgo.setDate(startOfToday.getDate() - 29); // incluye hoy → 30 días

                const filtered = data.filter(order => {
                    if (order.state === 'UNPAID') return false;

                    const raw = order.dateCreated; // puede ser 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss'
                    if (!raw) return false;
                    const datePart = String(raw).split('T')[0];
                    const d = new Date(datePart + 'T00:00:00');

                    switch (filter) {
                        case 'hoy':
                            return d.getTime() === startOfToday.getTime();
                        case 'semana':
                            return d >= sevenDaysAgo && d <= startOfToday;
                        case 'mes':
                            return d >= thirtyDaysAgo && d <= startOfToday;
                        case 'fecha':
                            if (!selectedDate) return true;
                            return datePart === selectedDate; // comparación directa YYYY-MM-DD
                        default:
                            return true;
                    }
                });

                // Ordenar por fecha descendente (más recientes primero)
                filtered.sort((a, b) => {
                    const aRaw = a.dateCreated;
                    const bRaw = b.dateCreated;
                    const aDate = aRaw && String(aRaw).includes('T') ? new Date(aRaw) : new Date(String(aRaw) + 'T00:00:00');
                    const bDate = bRaw && String(bRaw).includes('T') ? new Date(bRaw) : new Date(String(bRaw) + 'T00:00:00');
                    return bDate - aDate;
                });

                setOrders(filtered);
            } catch (e) {
                setError(e?.message || 'Error cargando órdenes');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user?.email, filter, selectedDate]);

    const renderOrderCard = (order) => {
        const raw = order?.dateCreated;
        const hasTime = raw && String(raw).includes('T');
        const dateObj = raw ? new Date(hasTime ? raw : String(raw) + 'T00:00:00') : null;
        const dateLabel = dateObj ? dateObj.toLocaleDateString('es-UY') : '—';
        const timeLabel = hasTime && dateObj ? dateObj.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }) : null;

        return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm text-gray-500">#{order.id}</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {dateLabel}
                            {timeLabel && <span className="ml-2 text-sm text-gray-500">· {timeLabel} hs</span>}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{order.deliveryStreet ? `${order.deliveryStreet}, ${order.deliveryCity}` : order.address || ''}</div>
                    </div>
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() => { setSelectedOrder(order); setIsStatusModalOpen(true); }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition"
                            title="Ver estado"
                        >
                            {ORDER_STATE_LABELS[order.state] || order.state}
                        </button>
                        {order.totalPrice > 0 && (
                            <div className="mt-2 text-gray-900 font-semibold">$ {Number(order.totalPrice).toLocaleString('es-UY')}</div>
                        )}
                    </div>
                </div>

                {order.notes && (
                    <div className="mt-3 text-sm text-gray-600">{order.notes}</div>
                )}

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                        Ver detalle
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={onBack}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ChevronLeft size={20} />
                    <span className="ml-1">Volver</span>
                </button>

                <div className="mt-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="text-orange-500" size={32} />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Historial de pedidos</h2>
                            <p className="text-gray-600 mt-1">Revisa tus órdenes pasadas y su estado</p>
                        </div>
                    </div>

                    {/* Filtro */}
                    <div className="relative inline-block text-left">
                        <details ref={detailsRef} className="group">
                            <summary className="list-none inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                                <FilterIcon size={16} />
                                <span className="font-medium">{filterLabel}</span>
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                </svg>
                            </summary>

                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none p-1 z-20">
                                <button onClick={() => handleSelectFilter('hoy')} className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${filter==='hoy' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}>Hoy</button>
                                <button onClick={() => handleSelectFilter('semana')} className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${filter==='semana' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}>Última semana</button>
                                <button onClick={() => handleSelectFilter('mes')} className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${filter==='mes' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}>Último mes</button>
                                <button onClick={() => handleSelectFilter('fecha')} className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${filter==='fecha' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}>
                                    <span className="inline-flex items-center gap-2"><Calendar size={16} /> Por fecha</span>
                                </button>
                            </div>
                        </details>

                        {/* Input de fecha oculto para usar el selector nativo */}
                        <input
                            ref={dateInputRef}
                            type="date"
                            className="sr-only"
                            onChange={(e) => {
                                const value = e.target.value || null;
                                setSelectedDate(value);
                                setFilter('fecha');
                            }}
                        />
                    </div>
                </div>

                {/* Estados de carga y error */}
                {loading && (
                    <div className="py-12 text-center text-gray-600">Cargando órdenes...</div>
                )}
                {error && (
                    <div className="py-12 text-center text-red-600">{error}</div>
                )}

                {/* Lista de pedidos */}
                {!loading && !error && (
                    orders.length === 0 ? (
                        <div className="py-12">
                            <div className="text-center bg-gray-50 rounded-lg p-8 border border-dashed border-gray-200">
                                <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">Sin pedidos para mostrar</h3>
                                <p className="text-gray-600">Cuando realices pedidos, aparecerán aquí. Usa los filtros para encontrarlos rápidamente.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(renderOrderCard)}
                        </div>
                    )
                )}

                {/* Modals */}
                <OrderStatusModal
                    isOpen={isStatusModalOpen}
                    onClose={() => { setIsStatusModalOpen(false); }}
                    order={selectedOrder}
                    title={`Estado del pedido`}
                    onOrderUpdated={(updated) => {
                        if (!updated) return;
                        // Update list and selected order state
                        setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, ...updated } : o));
                        setSelectedOrder(prev => (prev && prev.id === updated.id) ? { ...prev, ...updated } : prev);
                    }}
                />

                <OrderDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => { setIsDetailModalOpen(false); setSelectedOrder(null); }}
                    order={selectedOrder}
                    onOrderUpdated={(updated) => {
                        if (!updated) return;
                        // Update list and selected order state
                        setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, ...updated } : o));
                        setSelectedOrder(prev => (prev && prev.id === updated.id) ? { ...prev, ...updated } : prev);
                    }}
                />
            </main>
        </div>
    );
};

export default OrderHistoryPage;
