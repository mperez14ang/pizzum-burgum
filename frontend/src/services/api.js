const API_BASE_URL = 'http://localhost:8080/api';

const fetchFromAPI = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
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