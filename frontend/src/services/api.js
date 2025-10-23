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
                localStorage.removeItem('token');
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