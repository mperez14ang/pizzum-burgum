import {transformCreationData} from "../utils/parsers.jsx";

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const userStr = localStorage.getItem('user');
    let token = null;
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            token = user.token;
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
        }
    }
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const fetchFromAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('user');
                window.location.href = '/';
            }

            // Intentar obtener el mensaje de error del servidor
            let errorMessage = `Error: ${response.status}`;
            try {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage = errorText;
                }
            } catch (e) {
                // Si no puede parsear el error, usar el mensaje por defecto
            }

            throw new Error(errorMessage);
        }

        // Si la respuesta es 204 No Content o está vacía, retornar objeto vacío
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return {};
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
};

export const ingredientsService = {
    getAllIngredients: async () => {
        try {
            // LLAMADA REAL AL BACKEND
            const data = await fetchFromAPI('/products/ingredients');

            // Convertir precios de BigDecimal a Number
            const processedData = {};
            for (const [key, value] of Object.entries(data)) {
                processedData[key] = value.map(item => ({
                    ...item,
                    price: Number(item.price) || 0
                }));
            }

            return processedData;
        } catch (error) {
            console.error('Error cargando ingredientes:', error);
            throw error;
        }
    }
};

export const adminService = {
    // Products
    getAllProducts: async () => {
        return fetchFromAPI('/products', {
            method: 'GET'
        });
    },

    createProduct: async (product) => {
        return fetchFromAPI('/products', {
            method: 'POST',
            body: JSON.stringify(product)
        });
    },

    updateProduct: async (id, product) => {
        return fetchFromAPI(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product)
        });
    },

    deleteProduct: async (id) => {
        return fetchFromAPI(`/products/${id}`, {
            method: 'DELETE'
        });
    },

    toggleProductAvailability: async (id, available) => {
        return fetchFromAPI(`/products?id=${id}&available=${available}`, {
            method: 'PUT'
        });
    },

    getProductCategories: async () => {
        return fetchFromAPI('/products/categories');
    },

    getProductTypes: async () => {
        return fetchFromAPI('/products/types');
    },

    getProductTypesByCategory: async (category) => {
        return fetchFromAPI(`/products/types/${category}`);
    },

    // Orders
    getAllOrders: async () => {
        return fetchFromAPI('/order/v1');
    },

    getOrdersByState: async (state) => {
        return fetchFromAPI(`/order/v1/state/${state}`);
    },

    updateOrderState: async (id, state) => {
        return fetchFromAPI(`/order/v1/${id}/state`, {
            method: 'PATCH',
            body: JSON.stringify({ state })
        });
    },

    getOrderStates: async () => {
        return fetchFromAPI('/order/v1/states');
    },

    // Admins
    getAllAdmins: async () => {
        return fetchFromAPI('/admin/v1');
    },

    createAdmin: async (admin) => {
        return fetchFromAPI('/admin/v1', {
            method: 'POST',
            body: JSON.stringify(admin)
        });
    }
};
export const cartService = {
    //Agrega una creación personalizada al carrito
    addToCart: async (clientEmail, creationData, quantity) => {

        const transformedCreation = transformCreationData(creationData);

        return fetchFromAPI('/cart/v1/add', {
            method: 'POST',
            body: JSON.stringify({
                clientEmail,
                type: transformedCreation.type.toUpperCase(), // PIZZA o BURGER
                products: transformedCreation.products,
                quantity
            })
        });
    },
    //Agrega un producto extra al carrito (bebida, postre, papas, etc.)

    addExtraProduct: async (clientEmail, productId, productName, quantity = 1) => {
        return fetchFromAPI('/cart/v1/add', {
            method: 'POST',
            body: JSON.stringify({
                clientEmail,
                type: 'EXTRA',
                productIds: [productId], // Solo un producto
                quantity
            })
        });
    },
    //Obtiene el carrito activo del cliente
    getActiveCart: async () => {
        try {
            return await fetchFromAPI(`/cart/v1/my`);
        } catch (error) {
            // Si es 404 (no tiene carrito), retornar null
            if (error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    },

    //Obtiene un carrito por su ID
    getCartById: async (orderId) => {
        return fetchFromAPI(`/cart/v1/${orderId}`);
    },

    //Actualiza la cantidad de un item
    updateCartItem: async (orderId, itemId, quantity) => {
        return fetchFromAPI(`/cart/v1/${orderId}/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    },

    //Elimina un item del carrito

    removeCartItem: async (orderId, itemId) => {
        return fetchFromAPI(`/cart/v1/${orderId}/items/${itemId}`, {
            method: 'DELETE'
        });
    },

    //Vacía el carrito

    clearCart: async (orderId) => {
        return fetchFromAPI(`/cart/v1/${orderId}/clear`, {
            method: 'DELETE'
        });
    },

    //Finaliza la compra (checkout)
    checkout: async (orderId, addressId, paymentMethod) => {
        return fetchFromAPI(`/cart/v1/${orderId}/checkout`, {
            method: 'POST',
            body: JSON.stringify({
                addressId,
                paymentMethod
            })
        });
    }
};