import React, {useEffect, useState} from "react";
import {Check, CreditCard, Plus, Trash2} from "lucide-react";
import {useCard} from "../contexts/CardContext.jsx";
import CardModal from "../pages/modals/CardModal.jsx";

export const CardComponent = ({
                                  user,
                                  onSelectCard,
                                  hasTitle = true
                              }) => {
    const {
        cards,
        loading,
        getCards,
        createCard,
        deleteCard
    } = useCard();

    const [selectedCardId, setSelectedCardId] = useState('');
    const [showCardModal, setShowCardModal] = useState(false);

    // Cargar tarjetas al montar el componente
    useEffect(() => {
        getCards();
    }, []);

    useEffect(() => {
        // Buscar la tarjeta activa primero
        const activeCard = cards.find(c => c.active);

        if (activeCard) {
            setSelectedCardId(activeCard.id);
            if (onSelectCard) onSelectCard(activeCard.id);
        } else if (cards.length > 0 && !selectedCardId) {
            // Si no hay tarjeta activa, usar la primera
            setSelectedCardId(cards[0].id);
            if (onSelectCard) onSelectCard(cards[0].id);
        }
    }, [cards]);

    const getBrandIcon = (brand) => {
        const brandName = brand?.toLowerCase();

        const brandColors = {
            visa: "bg-blue-50 text-blue-600",
            mastercard: "bg-orange-50 text-orange-600",
            amex: "bg-indigo-50 text-indigo-600",
            discover: "bg-yellow-50 text-yellow-600",
        };

        return brandColors[brandName] || "bg-gray-50 text-gray-600";
    };

    const formatExpiration = (month, year) => {
        const formattedMonth = String(month).padStart(2, '0');
        return `${formattedMonth}/${String(year).slice(-2)}`;
    };

    const isExpired = (month, year) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        return year < currentYear || (year === currentYear && month < currentMonth);
    };

    const handleCardSelection = (cardId) => {
        setSelectedCardId(cardId);
        if (onSelectCard) onSelectCard(cardId);
    };

    const handleOpenCreateCard = () => {
        setShowCardModal(true);
    };

    const handleSaveCard = async () => {
        setShowCardModal(false);
        await getCards();

    };

    const handleCardDeletion = async (cardId) => {
        const response = await deleteCard(cardId);
        if (response){
            await getCards();
        }
    }


    return (
        <>
            <div>
                {hasTitle && (
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Tarjetas</h2>
                        </div>
                        {cards.length > 0 && (
                            <span className="text-sm text-gray-500">{cards.length} tarjeta{cards.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                )}

                {cards.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                            <CreditCard className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium mb-1">No tienes tarjetas guardadas</p>
                        <p className="text-gray-500 text-sm mb-6">Agrega una tarjeta para continuar</p>
                    </div>
                ) : (
                    <div className="space-y-3 mb-6">
                        {cards.map(card => {
                            const expired = isExpired(card.expirationMonth, card.expirationYear);
                            const isSelected = selectedCardId === card.id;

                            return (
                                <div
                                    key={card.id}
                                    onClick={() => handleCardSelection(card.id)}
                                    className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                                        isSelected
                                            ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {card.active && (
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                <Check size={12} className="mr-1" /> Activa
                                            </span>
                                        </div>
                                    )}

                                    {isSelected && !card.active && (
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                                <Check size={12} className="mr-1" /> Seleccionada
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${getBrandIcon(card.brand)}`}>
                                            <CreditCard className="w-5 h-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-gray-900 font-semibold capitalize">
                                                    {card.brand || 'Tarjeta'}
                                                </p>
                                            </div>

                                            <p className="text-gray-600 font-mono text-sm mb-1">
                                                {card.protectedNumber}
                                            </p>

                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                <span>Vence: {formatExpiration(card.expirationMonth, card.expirationYear)}</span>
                                                {expired && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-red-700 bg-red-50 font-medium">
                                                        Expirada
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardDeletion(card.id);
                                                }}
                                                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-red-300 text-red-600 hover:bg-red-50"
                                                type="button"
                                            >
                                                <Trash2 size={16} className="mr-1.5" /> Eliminar
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <button
                    onClick={handleOpenCreateCard}
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                >
                    <Plus size={16} className="mr-2" /> Agregar tarjeta
                </button>
            </div>

            <CardModal
                isOpen={showCardModal}
                onClose={() => setShowCardModal(false)}
                onSuccess={handleSaveCard}
            />
        </>
    );
};