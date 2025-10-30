import { useState } from 'react';
import { clientService } from '../services/api.js';
import toast from 'react-hot-toast';

export const useAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

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

    const handleCreateAddress = async (addressData, user) => {
        console.log(addressData)
        if (!user.email){
            toast.error("Usuario no esta autenticado")
        }

        const response = await clientService.addAddress(user.email, addressData.street, addressData.city, addressData.postalCode)

        if (response){
            toast.success("Address agregado con exito")
            await getAddresses()
            return
        }
        toast.error("No se pudo agregar el address")

    };

    return {
        addresses,
        isLoadingAddresses,
        handleCreateAddress,
        getAddresses

    };
};