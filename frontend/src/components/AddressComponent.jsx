import {Edit3, Plus, MapPin, Trash2, X} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import {AddAddressModal} from "../pages/modals/AddAddressModal.jsx";
import {clientService} from "../services/api.js";
import toast from "react-hot-toast";

export const AddressComponent = ({user, addresses, onSelectAddress, onEditAddress, onDeleteAddress, onCreateAddress}) => {
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState('');

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].id);
        }
    }, [addresses]);

    const selectedAddress = useMemo(
        () => addresses.find(a => a.id === selectedAddressId),
        [addresses, selectedAddressId]
    );

    const handleAddressChange = (e) => {
        const id = Number(e.target.value);
        setSelectedAddressId(id);
        if (onSelectAddress) onSelectAddress(id);
    };

    const handleAddressCreate = () => {
        setShowAddressModal(true);
    };

    const handleCreateSubmit = async (addressData) => {
        console.log(addressData)
        if (!user.email){
            toast.error("User email es null")
        }

        const response = await clientService.addAddress(user.email, addressData.street, addressData.city, addressData.postalCode)

        if (response){
            setShowAddressModal(false);
            toast.success("Address agregado con exito")
            return
        }
        toast.error("No se pudo agregar el address")

    };

    return (
        <div>
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
                        <MapPin className="w-5 h-5"/>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Direcciones</h2>
                </div>

                <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-center">
                    <select
                        value={selectedAddressId}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                        {addresses.length === 0 ? (
                            <option value="">Sin direcciones disponibles</option>
                        ) : (
                            addresses.map(addr => (
                                <option key={addr.id} value={addr.id}>
                                    {addr.street}, {addr.city} - CP {addr.postalCode}
                                </option>
                            ))
                        )}
                    </select>

                    <button
                        onClick={() => selectedAddress && onEditAddress && onEditAddress(selectedAddress.id)}
                        disabled={!selectedAddress}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        <Edit3 size={16} className="mr-2"/> Editar
                    </button>

                    <button
                        onClick={() => selectedAddress && onDeleteAddress && onDeleteAddress(selectedAddress.id)}
                        disabled={!selectedAddress}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-red-300 text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={16} className="mr-2"/> Eliminar
                    </button>
                </div>

                {selectedAddress && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Dirección seleccionada:</p>
                        <p className="text-gray-900 font-medium">{selectedAddress.street}</p>
                        <p className="text-gray-700 text-sm">{selectedAddress.city}, CP {selectedAddress.postalCode}</p>
                    </div>
                )}

                <div className="mt-4">
                    <button
                        onClick={handleAddressCreate}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2"/> Agregar dirección
                    </button>
                </div>
            </section>

            <AddAddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} onSave={handleCreateSubmit} />
        </div>
    );
};
