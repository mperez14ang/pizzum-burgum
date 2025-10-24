import React, {useMemo, useState} from 'react';
import {ChevronLeft, CreditCard, Edit3, KeyRound, MapPin, Plus, Trash2} from 'lucide-react';
import {Header} from "../components/common/header.jsx";
import CardModal from "./modals/CardModal.jsx";
import {AddAddressModal} from "./modals/AddAddressModal.jsx";
import {EditPasswordModal} from "./modals/EditPasswordModal.jsx";

// Skeleton-only Profile Page (no API calls). Prepared with props for future wiring.
// Expected props (all optional for now):
// - user: { firstName, lastName, addresses: [{ id, label }], cards: [{ id, brand, last4, label }] }
// - onBack: () => void
// - onSelectAddress: (addressId) => void
// - onEditAddress: (addressId) => void
// - onDeleteAddress: (addressId) => void
// - onAddAddress: () => void
// - onEditCard: (cardId) => void
// - onAddCard: () => void
// - onEditPassword: () => void

export const ProfilePage = ({
    user = {},
    onBack,
    onSelectAddress,
    onEditAddress,
    onDeleteAddress,
    onAddAddress,
    onEditCard,
    onAddCard,
    onEditPassword,
    onNavigate
                            }) => {
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';
    const addresses = user?.addresses ?? [];
    const cards = user?.cards ?? [];

    // Modals
    const [showCardModal, setShowCardModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [selectedAddressId, setSelectedAddressId] = useState(
        addresses.length ? addresses[0].id : ''
    );

    const selectedAddress = useMemo(
        () => addresses.find(a => a.id === selectedAddressId),
        [addresses, selectedAddressId]
    );

    const handleAddressChange = (e) => {
        const id = e.target.value;
        setSelectedAddressId(id);
        if (onSelectAddress) onSelectAddress(id);
    };

    const handleCreateCard = () => {setShowCardModal(true);}

    const handleAddressCreate = () => {setShowAddressModal(true);}

    const handleChangePassword = () => {setShowPasswordModal(true)}

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate}/>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ChevronLeft size={20}/>
                        <span className="ml-1">Volver</span>
                    </button>

                    {/* Discrete password edit button */}
                    <button
                        onClick={handleChangePassword}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
                        title="Editar contraseña"
                    >
                        <KeyRound size={16} className="mr-1"/>
                        Editar contraseña
                    </button>
                </div>

                {/* User name section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        Nombre: <span className="font-black">{firstName || '—'}</span>
                    </h1>
                    <p className="mt-3 text-2xl sm:text-3xl text-gray-700">
                        Apellido: <span className="font-semibold">{lastName || '—'}</span>
                    </p>
                </div>

                {/* Addresses section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <div
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
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
                                        {addr.label || `Dirección ${addr.id}`}
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

                    <div className="mt-4">
                        <button
                            onClick={handleAddressCreate}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                        >
                            <Plus size={16} className="mr-2"/> Agregar dirección
                        </button>
                    </div>
                </section>

                {/* Credit cards section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div
                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
                                <CreditCard className="w-5 h-5"/>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Tarjetas</h2>
                        </div>

                        <button
                            onClick={handleCreateCard}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                        >
                            <Plus size={16} className="mr-2"/> Agregar tarjeta
                        </button>
                    </div>

                    {cards.length === 0 ? (
                        <p className="text-gray-500 text-sm">No tienes tarjetas guardadas.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {cards.map(card => (
                                <li key={card.id} className="py-3 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-gray-900 font-medium">
                                            {card.label || card.brand || 'Tarjeta'} {card.last4 ? `•••• ${card.last4}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEditCard && onEditCard(card.id)}
                                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            <Edit3 size={16} className="mr-1.5"/> Editar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <CardModal isOpen={showCardModal} onClose={() => setShowCardModal(false)} />
                    <AddAddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} />
                    <EditPasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
