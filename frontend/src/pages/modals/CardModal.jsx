import React, { useEffect } from 'react';
import { AlertCircle, CreditCard, Check, Loader2, X } from 'lucide-react';
import { useCard } from '../contexts/CardContext.jsx';
import toast from "react-hot-toast";
import {Modal} from "../components/common/Modal.jsx";

export const CardPage = ({ onBack }) => {
    const {
        stripe,
        user,
        setCardElement,
        createCard,
        loading,
        error,
        success,
        cardholderName,
        setCardholderName,
        email,
        setEmail,
    } = useCard();

    useEffect(() => {
        if (!stripe) return;

        const elements = stripe.elements();
        const card = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    fontFamily: 'system-ui, sans-serif',
                    '::placeholder': { color: '#9ca3af' },
                    iconColor: '#6366f1',
                },
                invalid: { color: '#ef4444', iconColor: '#ef4444' },
            },
            hidePostalCode: false,
        });

        card.mount('#card-element');
        setCardElement(card);

        card.on('change', (event) => {
            if (event.error) {
                toast.error(event.error.message, { duration: 2000 })
            }
        });

        return () => card.destroy();
    }, [stripe]);

    return (
        <>
            <Modal
                isOpen={true}
                onClose={onBack}
                title=""
                size="md"
            >

                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <CreditCard className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Agregar Tarjeta</h2>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                        <p className="text-green-800 font-medium">¡Tarjeta guardada exitosamente!</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={createCard} className="space-y-6">
                    <div>
                        <label htmlFor="cardholder-name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del titular *
                        </label>
                        <input
                            type="text"
                            id="cardholder-name"
                            value={cardholderName}
                            placeholder={`${user.firstName} ${user.lastName}`}
                            onChange={(e) => setCardholderName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email (opcional)
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder={user.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Información de la tarjeta *</label>
                        <div id="card-element" className="p-4 border border-gray-300 rounded-lg bg-white" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !stripe}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center disabled:bg-gray-400"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Procesando...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5 mr-2" /> Guardar Tarjeta
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">🔒 Tus datos están protegidos y encriptados por Stripe</p>
                </div>
            </Modal>
        </>
    );

};

export default CardPage;