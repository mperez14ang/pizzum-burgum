import {cartService} from "../services/api.js";
import toast from "react-hot-toast";

export const cartInteraction = async ({setLoading, setError, setCartItems}) => {
    setLoading(true);
    setError(null);

    try {
        const response = await cartService.getActiveCart();

        if (response && response.items) {
            // Transformar los items del backend al formato del componente
            const transformedItems = response.items.map(item => {
                // Normalizar la ruta de la imagen
                let imageUrl = item.image;
                if (imageUrl && !imageUrl.startsWith('/')) {
                    imageUrl = '/' + imageUrl;
                }

                return {
                    id: item.itemId,
                    name: item.creationName,
                    price: item.unitPrice,
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    image: imageUrl
                };
            });

            setCartItems(transformedItems);
        } else {
            setCartItems([]);
        }
    } catch (err) {
        console.error('Error al obtener carrito:', err);
        setError('No se pudo cargar el carrito');
    } finally {
        setLoading(false);
    }
}

export const updateQuantity = async (itemId, newQuantity, cartItems, setCartItems, debounceTimers) => {
    if (newQuantity < 1) return;

    setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));

    if (debounceTimers.current[itemId]) {
        clearTimeout(debounceTimers.current[itemId]);
    }

    // Crear nuevo timeout para hacer el request
    debounceTimers.current[itemId] = setTimeout(async () => {
        try {
            await cartService.updateCartItem(itemId, newQuantity);
            toast.success('Cantidad actualizada');
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Error al actualizar cantidad');
        }
    }, 800);
};

export const removeItem = async (itemId, cartItems, setCartItems) => {
    try {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);

        await cartService.removeCartItem(itemId);

        toast.success('Producto eliminado');

    } catch (error) {
        console.error('Error removing item:', error);
        toast.error('Error al eliminar producto');
    }
};

export const cartSubtotal = (cartItems) => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export const cartItemCount = (cartItems) => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}