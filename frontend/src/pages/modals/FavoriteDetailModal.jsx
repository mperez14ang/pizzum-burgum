import { Modal } from "../../components/common/Modal.jsx";
import { PRODUCT_CONFIG } from "../../utils/ProductsConfig.jsx";

export const FavoriteDetailModal = ({ isOpen, onClose, favorite, onOrder }) => {
    if (!isOpen || !favorite) return null;

    // 🔍 DEBUG: Ver qué datos recibe el modal
    console.log('🔍 FavoriteDetailModal - favorite recibido:', favorite);
    console.log('🔍 favorite.creations:', favorite.creations);

    const safeCreations = Array.isArray(favorite?.creations)
        ? favorite.creations
        : [favorite]; // si no hay 'creations', tratamos al favorito como una sola creación

    console.log('🔍 safeCreations procesadas:', safeCreations);

    const renderSectionInfo = (creation) => {
        const typeKey = creation?.type === 'PIZZA' ? 'pizza' : (creation?.type === 'HAMBURGER' ? 'burger' : (creation?.type || '').toLowerCase());
        const productConfig = PRODUCT_CONFIG[typeKey];
        const selections = creation.selections;

        if (!productConfig?.sections) return null;

        return productConfig.sections.map((section) => {
            const value = selections?.[section.stateKey];
            if (!value) return null;

            // Multi-select
            if (section.type === "multi-select" && Array.isArray(value) && value.length > 0) {
                return (
                    <div key={section.id} className="mb-4">
                        <div className="font-semibold text-gray-700 mb-2">
                            {section.title.replace(/^\d+\.\s*/, "")}:
                        </div>
                        <div className="space-y-1 pl-3">
                            {value.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-600">• {item.name}</span>
                                    <span className="font-medium text-gray-900">
                                        {item.price > 0 ? `$${item.price}` : "Incluido"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            // Single select with quantity
            if (section.type === "single-select-with-quantity") {
                const quantity = selections?.[section.quantityConfig?.stateKey] || 1;
                return (
                    <div key={section.id} className="flex justify-between items-start mb-3">
                        <div>
                            <span className="font-semibold text-gray-700">
                                {section.title.replace(/^\d+\.\s*/, "")}:
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
                            {section.title.replace(/^\d+\.\s*/, "")}:
                        </span>
                        <div className="text-sm text-gray-600">{value.name}</div>
                    </div>
                    <span className="font-medium text-gray-900">
                        {value.price > 0 ? `$${value.price}` : "Incluido"}
                    </span>
                </div>
            );
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={favorite.name || 'Favorito'}
            size="lg"
        >
            {/* Imagen principal */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={favorite.image}
                    alt={favorite.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x300?text=Sin+imagen";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Detalles de tu creación
                </h3>

                {safeCreations.length === 0 ? (
                    <p className="text-gray-600">
                        Este favorito no tiene creaciones asociadas.
                    </p>
                ) : (
                    safeCreations.map((creation, idx) => (
                        <div
                            key={creation.id || idx}
                            className="bg-gray-50 rounded-xl p-4 mb-6 border shadow-sm"
                        >
                            <div className="mb-3">
                                <h4 className="font-semibold text-gray-900 text-lg">
                                    {creation.name || 'Creación personalizada'}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Precio: <span className="font-bold text-orange-600">${creation.price || 0}</span>
                                </p>
                            </div>

                            {/* Productos/Ingredientes del backend */}
                            {Array.isArray(creation.products) && creation.products.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700 mb-2 text-sm">
                                        Ingredientes ({creation.products.length}):
                                    </p>
                                    <div className="space-y-1.5">
                                        {creation.products.map((p, pIdx) => {
                                            console.log(`🔍 Producto ${pIdx}:`, p);
                                            const product = p.product || p;
                                            const quantity = p.quantity || 1;
                                            const productPrice = product.price || 0;
                                            const subtotal = productPrice * quantity;
                                            console.log(`   - Nombre: ${product.name}, Cantidad: ${quantity}, Precio: ${productPrice}, Subtotal: ${subtotal}`);

                                            return (
                                                <div
                                                    key={p.id || pIdx}
                                                    className="flex justify-between items-center bg-white rounded-lg p-2 hover:bg-gray-50 transition"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-800">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {product.productCategory && (
                                                                <span className="mr-2">
                                                                    {product.productCategory}
                                                                </span>
                                                            )}
                                                            {product.productType && (
                                                                <span className="text-gray-400">
                                                                    • {product.productType}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 ml-3">
                                                        {quantity > 1 && (
                                                            <span className="text-sm text-gray-600 font-medium">
                                                                × {quantity}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
                                                            ${subtotal.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    No hay ingredientes registrados
                                </p>
                            )}

                            {/* Si hay selections (desde el creador), mostrarlas también */}
                            {creation.selections && renderSectionInfo(creation) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="font-medium text-gray-700 mb-2 text-sm">
                                        Configuración original:
                                    </p>
                                    <div className="pl-2">{renderSectionInfo(creation)}</div>
                                </div>
                            )}
                        </div>
                    ))
                )}

                {/* Total general */}
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
                            ⚠️ Algunos ingredientes no están disponibles actualmente.
                        </p>
                    </div>
                )}

                {/* Metadata adicional */}
                <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Tipo:</span>
                            <span className="ml-2 font-medium text-gray-900">
                                {favorite.type === 'PIZZA' ? 'Pizza' : (favorite.type === 'HAMBURGER' ? 'Hamburguesa' : favorite.type)}
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

export default FavoriteDetailModal;
