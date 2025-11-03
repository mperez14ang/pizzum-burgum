import {Edit3, MapPin, Plus, Trash2} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import {useAddresses} from "../contexts/UseAddresses.jsx";
import toast from "react-hot-toast";
import {AddAddressModal} from "../pages/modals/AddAddressModal.jsx";
import {getBackendErrorMessage} from "../utils/parsers.jsx";

export const AddressComponent = ({
                                     user,
                                     onSelectAddress,
                                     hasTitle = true
                                 }) => {
    const {
        addresses,
        isLoadingAddresses,
        getAddresses,
        handleCreateAddress,
        handleUpdateAddress,
        handleDeleteAddress
    } = useAddresses();

    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    // Cargar direcciones al montar el componente
    useEffect(() => {
        getAddresses();
    }, []);

    useEffect(() => {
        // Buscar la dirección activa primero
        const activeAddress = addresses.find(a => a.active);

        if (activeAddress) {
            setSelectedAddressId(activeAddress.id);
            if (onSelectAddress) onSelectAddress(activeAddress.id);
        } else if (addresses.length > 0 && !selectedAddressId) {
            // Si no hay dirección activa, usar la primera
            setSelectedAddressId(addresses[0].id);
            if (onSelectAddress) onSelectAddress(addresses[0].id);
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

    const handleEditAddress = (addressId) => {
        setIsEditingAddress(true);
        setEditingAddressId(addressId);
        setShowAddressModal(true);
    };

    const handleOpenCreateAddress = () => {
        setIsEditingAddress(false);
        setEditingAddressId(null);
        setShowAddressModal(true);
    };

    const handleSaveAddress = async (addressId, addressData) => {
        let response = null;
        if (isEditingAddress) {
            response = await handleUpdateAddress(addressId, addressData);
        } else {
            response = await handleCreateAddress(addressData, user);
        }

        if (response) {
            setShowAddressModal(false);
            await getAddresses();
        }
    };

    const handleAddressDeletion = async () => {
        try {
            const response = await handleDeleteAddress(selectedAddress.id);
            if (response) {
                setSelectedAddressId(0);
                await getAddresses();
                if (response.message) {
                    toast.success(response.message);
                }
            }
        } catch (error) {
            const message = getBackendErrorMessage(error)
            toast.error(message)
        }
    };

    return (
        <>
            <div>
                {hasTitle && (
                    <div className="flex items-center mb-4">
                        <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
                            <MapPin className="w-5 h-5"/>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Direcciones</h2>
                    </div>
                )}

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
                                    {addr.active && " (Activa)"}
                                </option>
                            ))
                        )}
                    </select>

                    <button
                        onClick={() => selectedAddress && handleEditAddress(selectedAddress.id)}
                        disabled={!selectedAddress}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 text-gray-700 hover:bg-gray-50"
                        type="button"
                    >
                        <Edit3 size={16} className="mr-2"/> Editar
                    </button>

                    <button
                        onClick={handleAddressDeletion}
                        disabled={!selectedAddress}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-red-300 text-red-600 hover:bg-red-50"
                        type="button"
                    >
                        <Trash2 size={16} className="mr-2"/> Eliminar
                    </button>
                </div>

                {selectedAddress && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Dirección seleccionada:</p>
                        <p className="text-gray-900 font-medium">{selectedAddress.street}</p>
                        <p className="text-gray-700 text-sm">{selectedAddress.city}, CP {selectedAddress.postalCode}</p>
                        {selectedAddress.active && (
                            <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                Dirección activa
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-4">
                    <button
                        onClick={handleOpenCreateAddress}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                        type="button"
                    >
                        <Plus size={16} className="mr-2"/> Agregar dirección
                    </button>
                </div>
            </div>

            <AddAddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSave={handleSaveAddress}
                isEditingAddress={isEditingAddress}
                setIsEditingAddress={setIsEditingAddress}
                editingAddressId={editingAddressId}
                addresses={addresses}
            />
        </>
    );
};