import {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from './AuthContext';
import toast from "react-hot-toast";
import {clientService} from "../services/api.js";

const CardContext = createContext();

export const CardProvider = ({ children }) => {
    const { isAuthenticated, user, logout, tokenAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stripe, setStripe] = useState(null);
    const [cardElement, setCardElement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [cardholderName, setCardholderName] = useState('');
    const [email, setEmail] = useState('');
    const [cards, setCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    // Cargar stripe
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
            const stripeInstance = window.Stripe('pk_test_51SKUTRAFyqXIJVLlRXMlPUEvKehcOtLqhOUEFk5vubz7AxpHeNSxGSi5VyPGgYf8fRdlaSGOsgth4BYskWUDo0HL00jhYw91pK');
            setStripe(stripeInstance);
            setIsLoading(false);
        };
        document.head.appendChild(script);
    }, []);

    const createCard = async (e) => {
        e.preventDefault();

        if (!stripe || !cardElement) return;
        if (!cardholderName.trim()) {
            setError('Por favor ingresa el nombre del titular');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const paymentMethod = await createPaymentMethod();

            console.log('PaymentMethod ID:', paymentMethod.id);

            const response = await clientService.addCards(user.email, paymentMethod.id);
            console.log(response)
            if (response) {
                toast.success("La tarjeta se guardo con exito")
                setSuccess(true);
                setCardholderName('');
                setEmail('');
                cardElement.clear();
                setTimeout(() => setSuccess(false), 3000);
                return response
            } else {
                setError('Backend no disponible. PaymentMethod ID creado: ' + paymentMethod.id);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error al procesar la tarjeta. Por favor intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const getCards = async () => {
        setIsLoadingCards(true);
        try {
            const newCards = await clientService.getCards();
            setCards(newCards);
            console.log(newCards);
        } catch (error) {
            console.error('Error al cargar las tarjetas:', error);
            toast.error('Error al cargar las tarjetas');
        } finally {
            setIsLoadingCards(false);
        }
    };

    const deleteCard = async (cardId) => {
        const response = await clientService.deleteCard(cardId)

        if (response){
            toast.success("Tarjeta " + cardId + " borrada con exito")
            return true
        }
        toast.error(response.error)
    }

    const createPaymentMethod = async () => {
        const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: cardholderName,
                email: email || undefined,
            },
        });

        if (stripeError) {
            setError(stripeError.message);
            return;
        }
        return paymentMethod;
    }

    return (
        <CardContext.Provider
            value={{
                isAuthenticated,
                cards,
                user,
                logout,
                isLoading,
                stripe,
                cardElement,
                setCardElement,
                loading,
                isLoadingCards,
                error,
                success,
                cardholderName,
                setCardholderName,
                email,
                setEmail,
                createCard,
                getCards,
                deleteCard
            }}
        >
            {children}
        </CardContext.Provider>
    );
};

export const useCard = () => {
    const context = useContext(CardContext);
    if (!context) throw new Error('useCard debe usarse dentro de CardProvider');
    return context;
};
