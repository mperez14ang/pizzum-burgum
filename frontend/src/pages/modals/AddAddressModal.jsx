import {Plus} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {Modal} from "../../components/common/Modal.jsx";
import toast from "react-hot-toast";

export const AddAddressModal = (
    {isOpen, onSave, onClose, isEditingAddress, setIsEditingAddress, editingAddressId, addresses
                                }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        postalCode: ''
    });

    useEffect(() => {
        const handleEditAddress = async () => {
            if (isEditingAddress && isOpen) {
                try {
                    setIsLoading(true);
                    if (!addresses) {
                        toast.error("No se pudo encontrar una direccion valida");
                        handleOnClose();
                        return;
                    }

                    const address = addresses.find(addr => addr.id === editingAddressId);
                    if (!address) {
                        toast.error("No se pudo encontrar la dirección correspondiente");
                        handleOnClose();
                        return;
                    }

                    setFormData({
                        street: address.street,
                        city: address.city,
                        postalCode: address.postalCode
                    });
                } catch (error) {
                    console.error(error);
                    toast.error("Error al cargar dirección");
                } finally {
                    setIsLoading(false);
                }
            } else if (!isEditingAddress && isOpen) {
                // si es una dirección nueva, limpiar los campos
                setFormData({
                    street: '',
                    city: '',
                    postalCode: ''
                });
            }
        };

        handleEditAddress();
    }, [isOpen, isEditingAddress, editingAddressId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editingAddressId, formData);
    };

    const handleOnClose = () => {
        setIsEditingAddress(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleOnClose}
            title={isEditingAddress ? "Editar Dirección" : "Agregar Dirección"}
            size="md"
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <span className="text-gray-500 text-sm">Cargando dirección...</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                            Calle y número *
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Ej: Av. 18 de Julio 1234"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Montevideo"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Código Postal *
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="11200"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleOnClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center justify-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Guardar
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
