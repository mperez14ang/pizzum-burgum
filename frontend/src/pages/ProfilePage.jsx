import React, {useEffect, useMemo, useState} from 'react';
import {ChevronLeft, CreditCard, Edit3, KeyRound, MapPin, Plus, Trash2} from 'lucide-react';
import {Header} from "../components/common/header.jsx";
import CardModal from "./modals/CardModal.jsx";
import {AddAddressModal} from "./modals/AddAddressModal.jsx";
import {EditPasswordModal} from "./modals/EditPasswordModal.jsx";
import {capitalize} from "../utils/StringUtils.jsx";
import {AddressComponent} from "../components/AddressComponent.jsx";
import {clientService} from "../services/api.js";
import toast from "react-hot-toast";
import {CardComponent} from "../components/CardComponent.jsx";

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
    onEditCard,
    onAddCard,
    onEditPassword,
    onNavigate
                            }) => {
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';
    const cards = user?.cards ?? [];
    const [addresses, setAddresses] = useState([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    // Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        getAddresses();
    }, []);

    const getAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
            const new_addresses = await clientService.getAddresses();
            setAddresses(new_addresses);
            console.log(new_addresses);
        } catch (error) {
            console.error('Error al cargar direcciones:', error);
            toast.error('Error al cargar direcciones');
        } finally {
            setIsLoadingAddresses(false);
        }
    };

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
                        Nombre: <span className="font-black">{capitalize(firstName) || '—'}</span> <span className="font-black">{capitalize(lastName) || '—'}</span>
                    </h1>
                </div>

                <AddressComponent user={user} addresses={addresses} />

                <CardComponent cards={cards}/>

                <EditPasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
            </div>
        </div>
    );
};

export default ProfilePage;
