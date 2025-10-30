import {Modal} from "../../components/common/Modal.jsx";

export const FavoriteDetailModal = ({ isOpen, onClose, favorite }) => {
    const safeCreations = Array.isArray(favorite?.creations) ? favorite.creations : [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detalle del Favorito #${favorite?.id ?? ''}`}
            size="lg"
        >
            {!favorite ? (
                <p className="text-gray-600">No hay información disponible.</p>
            ) : (
                <div className="space-y-4">
                    {safeCreations.length === 0 ? (
                        <p className="text-gray-600">Este favorito no tiene creaciones asociadas.</p>
                    ) : (
                        safeCreations.map((creation) => (
                            <div key={creation.id} className="border rounded-xl p-4 bg-gray-50 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900">
                                        {creation.name || "Sin nombre"}
                                    </h4>
                                    <span className="text-sm text-gray-600">
                                        {creation.type} — ${creation.price}
                                    </span>
                                </div>

                                {Array.isArray(creation.products) && creation.products.length > 0 ? (
                                    <div className="mt-2 pl-3 border-l-2 border-gray-300">
                                        <p className="font-medium text-gray-700 mb-1 text-sm">Ingredientes:</p>
                                        <ul className="space-y-1 text-sm">
                                            {creation.products.map((p) => (
                                                <li key={p.id} className="flex justify-between text-gray-700">
                                                    <span>
                                                        {p["product"]?.name} ({p["product"]?.productType})
                                                    </span>
                                                    {p.quantity != null && (
                                                        <span className="text-gray-600">x{p.quantity}</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Sin ingredientes disponibles.</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </Modal>
    )
}

export default FavoriteDetailModal;
