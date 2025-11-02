import { useState } from 'react';
import { clientService } from '../services/api.js';
import toast from 'react-hot-toast';

export const useCards = () => {
    const [cards, setCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

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

    const handleCreateCard = async (paymentMethodId, userEmail) => {
        if (!userEmail) {
            toast.error("Usuario no está autenticado");
            return false;
        }

        if (!paymentMethodId) {
            toast.error("Método de pago inválido");
            return false;
        }

        try {
            const response = await clientService.addCards(userEmail, paymentMethodId);

            if (response) {
                toast.success("Tarjeta agregada con éxito");
                await getCards();
                return true;
            }
            else {
                toast.error("No se pudo agregar la tarjeta");
            }

            return false;
        } catch (error) {
            console.error('Error al crear tarjeta:', error);
            toast.error("Error al agregar la tarjeta");
            return false;
        }
    };

    const handleDeleteCard = async (cardId) => {
        const response = await clientService.deleteCard(cardId)

        if (response){
            toast.success("Tarjeta " + cardId + " borrada con exito")
            return true
        }
        toast.success(response.error)
    }

    return {
        cards,
        isLoadingCards,
        getCards,
        handleCreateCard,
        handleDeleteCard
    };
};