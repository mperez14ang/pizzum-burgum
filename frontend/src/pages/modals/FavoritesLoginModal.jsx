import {Heart} from 'lucide-react';
import React from 'react';
import {Modal} from "../../components/common/Modal.jsx";

export const FavoritesLoginModal = ({ isOpen, onOpenLogin, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="md"
        >
            <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="text-orange-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Inicia sesión para guardar favoritos
                </h3>
                <p className="text-gray-600">
                    Crea una cuenta o inicia sesión para guardar tus creaciones favoritas
                </p>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onOpenLogin}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={onClose}
                    className="w-full border-2 border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                    Cancelar
                </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
                Iniciar Sesión
            </p>
        </Modal>
    );
};