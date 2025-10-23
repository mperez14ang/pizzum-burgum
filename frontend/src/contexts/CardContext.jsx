import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from "react-hot-toast";

const CardContext = createContext();

export const CardProvider = ({ children }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stripe, setStripe] = useState(null);
    const [cardElement, setCardElement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [cardholderName, setCardholderName] = useState('');
    const [email, setEmail] = useState('');

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

            console.log('PaymentMethod ID:', paymentMethod.id);

            const basicAuth = btoa(`${user.email}:${user.password}`);

            const response = await fetch('http://localhost:8080/api/card/v1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${basicAuth}`,
                },
                body: JSON.stringify({
                    clientEmail: user.email,
                    paymentMethodId: paymentMethod.id
                }),
            });

            if (response.ok) {
                toast.success("La tarjeta se guardo con exito", { duration: 2000 })
                setSuccess(true);
                setCardholderName('');
                setEmail('');
                cardElement.clear();
                setTimeout(() => setSuccess(false), 3000);
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

    return (
        <CardContext.Provider
            value={{
                isAuthenticated,
                user,
                logout,
                isLoading,
                stripe,
                cardElement,
                setCardElement,
                loading,
                error,
                success,
                cardholderName,
                setCardholderName,
                email,
                setEmail,
                createCard,
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
