import React, {useState} from "react";
import {Edit3, CreditCard, Plus} from "lucide-react";
import CardModal from "../pages/modals/CardModal.jsx";

export const CardComponent = ( {cards, onEditCard} ) => {

    const [showCardModal, setShowCardModal] = useState(false);

    const handleCreateCard = () => {setShowCardModal(true);}

    return <div>
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
        </section>
        <CardModal isOpen={showCardModal} onClose={() => setShowCardModal(false)} />
    </div>
}
