import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '../components/common/Header';
import { ChevronLeft, Filter as FilterIcon, Calendar, Clock } from 'lucide-react';

export const OrderHistoryPage = ({ onNavigate, onBack }) => {
    const [filter, setFilter] = useState('hoy'); // 'hoy' | 'semana' | 'mes' | 'fecha'
    const [selectedDate, setSelectedDate] = useState(null); // yyyy-mm-dd

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
            case 'fecha':
                return selectedDate ? new Date(selectedDate).toLocaleDateString('es-UY') : 'Por fecha';
            default:
                return 'Filtrar';
        }
    }, [filter, selectedDate]);

    // Esqueleto sin conexión a backend
    const orders = [];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate} />

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

                {/* Lista de pedidos (esqueleto) */}
                {orders.length === 0 ? (
                    <div className="py-12">
                        <div className="text-center bg-gray-50 rounded-lg p-8 border border-dashed border-gray-200">
                            <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Sin pedidos para mostrar</h3>
                            <p className="text-gray-600">Cuando realices pedidos, aparecerán aquí. Usa los filtros para encontrarlos rápidamente.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Aquí irían las tarjetas de pedidos manteniendo el estilo del proyecto */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderHistoryPage;
