// Configuración centralizada de productos
export const PRODUCT_CONFIG = {
    pizza: {
        type: 'PIZZA',
        emoji: '🍕',
        displayName: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        placeholder: 'Ej: Mi Pizza Suprema',

        sections: [
            {
                id: 'size',
                title: '1. Tamaño',
                required: true,
                ingredientKey: 'PIZZA_SIZES',
                stateKey: 'selectedSize',
                type: 'single-select',
                gridCols: 3
            },
            {
                id: 'dough',
                title: '2. Tipo de Masa',
                required: true,
                ingredientKey: 'PIZZA_DOUGH',
                stateKey: 'selectedDough',
                type: 'single-select',
                gridCols: 3
            },
            {
                id: 'sauce',
                title: '3. Salsa',
                required: false,
                ingredientKey: 'PIZZA_SAUCE',
                stateKey: 'selectedSauce',
                type: 'single-select',
                gridCols: 2
            },
            {
                id: 'cheese',
                title: '4. Queso',
                required: false,
                ingredientKey: 'PIZZA_CHEESE',
                stateKey: 'selectedCheese',
                type: 'single-select',
                gridCols: 2
            },
            {
                id: 'toppings',
                title: '5. Toppings',
                required: false,
                ingredientKey: 'PIZZA_TOPPINGS',
                stateKey: 'selectedToppings',
                type: 'multi-select',
                gridCols: 3,
                maxItems: 10,
                showCounter: true
            }
        ],

        // Validaciones
        validations: {
            size: { required: true, message: 'El tamaño de la pizza es obligatorio' },
            dough: { required: true, message: 'El tipo de masa es obligatorio' }
        }
    },

    burger: {
        type: 'HAMBURGER',
        emoji: '🍔',
        displayName: 'Hamburguesa',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        placeholder: 'Ej: Mi Burger Especial',

        sections: [
            {
                id: 'bread',
                title: '1. Tipo de Pan',
                required: true,
                ingredientKey: 'BREAD_OPTIONS',
                stateKey: 'selectedBread',
                type: 'single-select',
                gridCols: 3
            },
            {
                id: 'meat',
                title: '2. Tipo de Carne',
                required: true,
                ingredientKey: 'MEAT_OPTIONS',
                stateKey: 'selectedMeat',
                type: 'single-select-with-quantity',
                gridCols: 2,
                quantityConfig: {
                    min: 1,
                    max: 3,
                    stateKey: 'meatQuantity'
                }
            },
            {
                id: 'cheese',
                title: '3. Queso',
                required: false,
                ingredientKey: 'BURGER_CHEESE',
                stateKey: 'selectedBurgerCheese',
                type: 'single-select',
                gridCols: 2
            },
            {
                id: 'toppings',
                title: '4. Toppings',
                required: false,
                ingredientKey: 'BURGER_TOPPINGS',
                stateKey: 'selectedBurgerToppings',
                type: 'multi-select',
                gridCols: 3
            },
            {
                id: 'sauces',
                title: '5. Salsas',
                required: false,
                ingredientKey: 'BURGER_SAUCES',
                stateKey: 'selectedBurgerSauces',
                type: 'multi-select',
                gridCols: 3
            }
        ],

        validations: {
            bread: { required: true, message: 'El tipo de pan es obligatorio' },
            meat: { required: true, message: 'Debe seleccionar al menos un tipo de carne' }
        }
    }
};

export const addNewProduct = (productKey, config) => {
    PRODUCT_CONFIG[productKey] = config;
};