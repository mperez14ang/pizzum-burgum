import React, { useEffect, useState } from 'react';
import { ChevronLeft, KeyRound } from 'lucide-react';
import { Header } from "../components/common/header.jsx";
import { EditPasswordModal } from "./modals/EditPasswordModal.jsx";
import { capitalize } from "../utils/StringUtils.jsx";
import { AddressComponent } from "../components/AddressComponent.jsx";
import { CardComponent } from "../components/CardComponent.jsx";
import CardModal from "./modals/CardModal.jsx";
import { AddAddressModal } from "./modals/AddAddressModal.jsx";
import {useCards} from "../contexts/UseCards.jsx";
import {useAddresses} from "../contexts/UseAddresses.jsx";

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

    const { cards, isLoadingCards, getCards, handleCreateCard } = useCards();
    const { addresses, isLoadingAddresses, getAddresses, handleCreateAddress } = useAddresses();

    // Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    useEffect(() => {
        getAddresses();
        getCards();
    }, []);

    const handleCreateAddressSubmit = async (addressData) => {
        const success = await handleCreateAddress(addressData, user);
        if (success) {
            setShowAddressModal(false);
            getAddresses()
        }
    };

    const handleCreateCardSubmit = async (cardData) => {
        const success = await handleCreateCard(cardData, user);
        if (success) {
            setShowCardModal(false);
            getCards()
        }
    };

    const handleChangePassword = () => {
        setShowPasswordModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ChevronLeft size={20} />
                        <span className="ml-1">Volver</span>
                    </button>

                    {/* Discrete password edit button */}
                    <button
                        onClick={handleChangePassword}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
                        title="Editar contraseña"
                    >
                        <KeyRound size={16} className="mr-1" />
                        Editar contraseña
                    </button>
                </div>

                {/* User name section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        Nombre: <span className="font-black">{capitalize(firstName) || '—'}</span> <span className="font-black">{capitalize(lastName) || '—'}</span>
                    </h1>
                </div>

                <AddressComponent
                    user={user}
                    addresses={addresses}
                    onOpenCreateAddress={() => setShowAddressModal(true)}
                />

                <CardComponent
                    cards={cards}
                    onOpenCreateCard={() => setShowCardModal(true)}
                />

                <EditPasswordModal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                />
            </div>

            <CardModal
                isOpen={showCardModal}
                onClose={() => setShowCardModal(false)}
                onSave={handleCreateCardSubmit}
            />

            <AddAddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSave={handleCreateAddressSubmit}
            />
        </div>
    );
};

export default ProfilePage;