import { ShoppingBag, Plus, ArrowRight } from 'lucide-react';
import { Modal } from '../../components/common/Modal.jsx';

export const AddToCartModal = ({ isOpen, onClose, onContinueShopping, onGoToExtras, productType }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="¡Agregado al carrito!"
            size="md"
        >
            <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Tu {productType === 'pizza' ? 'pizza' : 'hamburguesa'} se agregó al carrito
                </h3>
                <p className="text-gray-600 mb-6">
                    ¿Qué te gustaría hacer ahora?
                </p>

                <div className="space-y-3">
                    {/* Botón para crear otra creación - Lleva al homepage */}
                    <button
                        onClick={onContinueShopping}
                        className="w-full bg-gray-100 text-gray-900 py-4 px-6 rounded-lg hover:bg-gray-200 transition flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <Plus className="w-5 h-5" />
                            <div className="text-left">
                                <div className="font-semibold">Seguir Agregando Creaciones</div>
                                <div className="text-sm text-gray-600">Crear más pizzas o hamburguesas</div>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Botón para ir a productos extra*/}
                    <button
                        onClick={onGoToExtras}
                        className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg hover:bg-orange-600 transition flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5" />
                            <div className="text-left">
                                <div className="font-semibold">Continuar al Carrito</div>
                                <div className="text-sm text-orange-100">Ver productos extra y finalizar</div>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
        </Modal>
    );
};
