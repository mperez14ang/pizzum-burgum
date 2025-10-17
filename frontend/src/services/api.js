
const API_BASE_URL = 'http://localhost:8080/api';

const fetchFromAPI = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
};

export const ingredientsService = {
    getAllIngredients: async () => {
        // Mientras el backend no esté listo, retorna datos mock
        // Cuando esté listo, descomentar las llamadas reales

        /* VERSIÓN CON BACKEND REAL:
        const [
          BREAD_OPTIONS,
          MEAT_OPTIONS,
          BURGER_CHEESE,
          BURGER_TOPPINGS,
          BURGER_SAUCES,
          PIZZA_DOUGH,
          PIZZA_SIZES,
          PIZZA_SAUCE,
          PIZZA_CHEESE,
          PIZZA_TOPPINGS
        ] = await Promise.all([
          fetchFromAPI('/bread-options'),
          fetchFromAPI('/meat-options'),
          fetchFromAPI('/burger-cheese'),
          fetchFromAPI('/burger-toppings'),
          fetchFromAPI('/burger-sauces'),
          fetchFromAPI('/pizza-dough'),
          fetchFromAPI('/pizza-sizes'),
          fetchFromAPI('/pizza-sauce'),
          fetchFromAPI('/pizza-cheese'),
          fetchFromAPI('/pizza-toppings')
        ]);

        return {
          BREAD_OPTIONS,
          MEAT_OPTIONS,
          BURGER_CHEESE,
          BURGER_TOPPINGS,
          BURGER_SAUCES,
          PIZZA_DOUGH,
          PIZZA_SIZES,
          PIZZA_SAUCE,
          PIZZA_CHEESE,
          PIZZA_TOPPINGS
        };
        */

        // DATOS MOCK TEMPORALES
        return {
            PIZZA_SIZES: [
                { id: 1, name: 'Pequeña', price: 200 },
                { id: 2, name: 'Mediana', price: 300 },
                { id: 3, name: 'Grande', price: 400 }
            ],
            PIZZA_DOUGH: [
                { id: 1, name: 'Napolitana', price: 0 },
                { id: 2, name: 'Integral', price: 50 },
                { id: 3, name: 'Sin Gluten', price: 80 }
            ],
            PIZZA_SAUCE: [
                { id: 1, name: 'Tomate', price: 0 },
                { id: 2, name: 'Pomodoro', price: 30 },
                { id: 3, name: '4 Quesos', price: 60 }
            ],
            PIZZA_CHEESE: [
                { id: 1, name: 'Mozzarella', price: 0 },
                { id: 2, name: 'Roquefort', price: 70 },
                { id: 3, name: 'Cheddar', price: 50 }
            ],
            PIZZA_TOPPINGS: [
                { id: 1, name: 'Pepperoni', price: 80 },
                { id: 2, name: 'Jamón', price: 60 },
                { id: 3, name: 'Champiñones', price: 50 },
                { id: 4, name: 'Aceitunas', price: 40 },
                { id: 5, name: 'Pimientos', price: 40 }
            ],
            BREAD_OPTIONS: [
                { id: 1, name: 'Pan de Papa', price: 0 },
                { id: 2, name: 'Integral', price: 30 },
                { id: 3, name: 'Sin Gluten', price: 50 }
            ],
            MEAT_OPTIONS: [
                { id: 1, name: 'Carne de Vaca', price: 150 },
                { id: 2, name: 'Pollo', price: 120 },
                { id: 3, name: 'Cerdo', price: 130 },
                { id: 4, name: 'Vegetariana (Lentejas)', price: 100 }
            ],
            BURGER_CHEESE: [
                { id: 1, name: 'Cheddar', price: 0 },
                { id: 2, name: 'Mozzarella', price: 30 },
                { id: 3, name: 'Roquefort', price: 50 }
            ],
            BURGER_TOPPINGS: [
                { id: 1, name: 'Lechuga', price: 0 },
                { id: 2, name: 'Tomate', price: 0 },
                { id: 3, name: 'Cebolla', price: 0 },
                { id: 4, name: 'Pepinillos', price: 30 },
                { id: 5, name: 'Bacon', price: 60 },
                { id: 6, name: 'Huevo', price: 40 }
            ],
            BURGER_SAUCES: [
                { id: 1, name: 'Ketchup', price: 0 },
                { id: 2, name: 'Mostaza', price: 0 },
                { id: 3, name: 'Mayonesa', price: 0 },
                { id: 4, name: 'BBQ', price: 30 },
                { id: 5, name: 'Salsa Picante', price: 20 }
            ]
        };
    }
};