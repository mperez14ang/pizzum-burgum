import {PRODUCT_CONFIG} from '../../utils/ProductsConfig';
import {Modal} from "../../components/common/Modal.jsx";

export const FavoriteInfoModal = ({ isOpen, onClose, favorite, onOrder }) => {
    if (!isOpen || !favorite) return null;

    const productConfig = PRODUCT_CONFIG[favorite.type];
    const selections = favorite.selections;

    const renderSectionInfo = (section) => {
        const value = selections[section.stateKey];
        if (!value) return null;

        // Multi-select (arrays)
        if (section.type === 'multi-select' && Array.isArray(value) && value.length > 0) {
            return (
                <div key={section.id} className="mb-4">
                    <div className="font-semibold text-gray-700 mb-2">
                        {section.title.replace(/^\d+\.\s*/, '')}:
                    </div>
                    <div className="space-y-1 pl-3">
                        {value.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">• {item.name}</span>
                                <span className="font-medium text-gray-900">
                                    {item.price > 0 ? `$${item.price}` : 'Incluido'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Single select with quantity
        if (section.type === 'single-select-with-quantity') {
            const quantity = selections[section.quantityConfig?.stateKey] || 1;
            return (
                <div key={section.id} className="flex justify-between items-start mb-3">
                    <div>
                        <span className="font-semibold text-gray-700">
                            {section.title.replace(/^\d+\.\s*/, '')}:
                        </span>
                        <div className="text-sm text-gray-600">
                            {value.name} × {quantity}
                        </div>
                    </div>
                    <span className="font-medium text-gray-900">
                        ${(value.price * quantity).toFixed(2)}
                    </span>
                </div>
            );
        }

        // Single select
        return (
            <div key={section.id} className="flex justify-between items-start mb-3">
                <div>
                    <span className="font-semibold text-gray-700">
                        {section.title.replace(/^\d+\.\s*/, '')}:
                    </span>
                    <div className="text-sm text-gray-600">{value.name}</div>
                </div>
                <span className="font-medium text-gray-900">
                    {value.price > 0 ? `$${value.price}` : 'Incluido'}
                </span>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${favorite.name}`}>
             {/* Imagen */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={favorite.image}
                        alt={favorite.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x300?text=Sin+imagen';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Detalles de tu creación
                    </h3>

                    {/* Ingredientes/Selecciones */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        {productConfig?.sections.map(renderSectionInfo)}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">Total:</span>
                            <span className="text-2xl font-bold text-orange-500">
                                ${favorite.price}
                            </span>
                        </div>
                    </div>

                    {/* Estado de disponibilidad */}
                    {!favorite.available && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Algunos ingredientes no están disponibles actualmente
                            </p>
                        </div>
                    )}

                    {/* Metadata adicional */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Tipo:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                    {productConfig?.displayName}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Creaciones:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                    {favorite.creationCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="border-t p-6">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Cerrar
                        </button>
                        {!favorite.available && (
                            <button
                                disabled
                                className="flex-1 px-4 py-2 bg-gray-400 text-gray-200 rounded-lg cursor-not-allowed font-medium"
                            >
                                No disponible
                            </button>
                        )}
                        {favorite.available && (
                            <button
                                onClick={onOrder}
                                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                            >
                                Ordenar ahora
                            </button>
                        )}
                    </div>
                </div>
        </Modal>
    );
};