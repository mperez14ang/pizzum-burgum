import {cartService, clientService} from "../services/api.js";
import toast from "react-hot-toast";
import {useCart} from "../contexts/CartContext.jsx";

export const cartInteraction = async ({setLoading, setError, setCartItems}) => {
    setLoading(true);
    setError(null);

    try {
        const response = await cartService.getActiveCart();

        if (response && response.items) {
            // Transformar los items del backend al formato del componente
            const transformedItems = response.items.map(item => {
                // Normalizar la ruta de la imagen
                let image = item.image;
                if (image && !image.startsWith('/')) {
                    image = '/' + image;
                }

                return {
                    id: item.itemId,
                    name: item.creationName,
                    price: item.unitPrice,
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    image: image,
                    type: item.type,
                    extraType: item.extraType,
                    available: item.available
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

// Crear datos de creación para API
export const createCreationData = ({productConfig, favoriteName, selections, price = null, quantity = 1}) => {
    const data = {
        name: favoriteName.trim(),
        type: productConfig.type,
        quantity: quantity
    };

    // Calcular precio si no se proporciona
    if (price !== null) {
        data.price = price;
    } else {
        let calculatedPrice = 0;
        productConfig.sections.forEach(section => {
            const value = selections[section.stateKey];
            if (!value) return;

            if (section.type === 'multi-select' && Array.isArray(value)) {
                value.forEach(item => {
                    calculatedPrice += item.price || 0;
                });
            } else if (section.type === 'single-select-with-quantity') {
                const qty = selections[section.quantityConfig.stateKey] || 1;
                calculatedPrice += (value.price || 0) * qty;
            } else {
                calculatedPrice += value.price || 0;
            }
        });
        data.price = calculatedPrice;
    }

    // Mapear selecciones a formato de API
    productConfig.sections.forEach(section => {
        const value = selections[section.stateKey];
        if (value) {
            if (section.type === 'single-select-with-quantity') {
                data[section.id] = value;
                data[`${section.id}Quantity`] = selections[section.quantityConfig.stateKey] || 1;
            } else {
                data[section.id] = value;
            }
        }
    });

    return data;
};

export const handleAddFavoriteToCart = async (favorite, isAuthenticated, itemCount, setCartItemCount) => {
    if (!isAuthenticated) {
        toast.error("Debe autenticarse para agregar al carrito");
        return;
    }

    const result = await cartService.addCreationToCart(favorite.creationId, 1);

    if (result) {
        if (result?.error){
            toast.error(result.error)

            return;
        }
        setCartItemCount(itemCount + 1)
        toast.success(`${favorite.name} agregado al carrito`, { duration: 2000 });
    } else {
        toast.error('Error al guardar en carrito: ' + (result.error || 'Intenta de nuevo'), { duration: 2000 });
    }
};

// Agregar al carrito
export const handleAddToCart = async (
    {isAuthenticated, productConfig, favoriteName, selections, setCartItemCount, itemCount,
        setShowCartModal = null, validateSelections = null,
                                      }) => {
    if (!isAuthenticated) {
        toast.error("Debes iniciar sesión para agregar al carrito");
        return;
    }

    if (validateSelections && !validateSelections()) return;

    const creationData = createCreationData({ productConfig, favoriteName, selections });
    if (!creationData) {
        toast.error("Datos de producto inválidos");
        return;
    }

    if (setShowCartModal) {
        setShowCartModal(true);
    }

    try {
        const result = await cartService.addToCart(creationData, 1);

        if (!result) {
            toast.error("No se pudo agregar al carrito");
            return;
        }

        toast.success("Agregado al carrito");

        const newCount = (itemCount || 0) + 1;
        setCartItemCount(newCount);
        localStorage.setItem("cartItemCount", newCount);

    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        toast.error("Ocurrió un error al agregar al carrito");
    }
};

export const handleAddExtrasToCart = async (items, onAdd) => {
    const products = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
    }));

    const result = await cartService.addExtrasToCart(products);

    if (result){
        onAdd()
    }
}
