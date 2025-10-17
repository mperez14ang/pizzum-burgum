import { createContext, useContext, useState } from 'react';

const CreatorContext = createContext(null);

export const CreatorProvider = ({ children }) => {
    const [state, setState] = useState({
        productBase: null,
        selectedIngredients: [],
        totalPrice: 0,
        quantity: 1
    });

    const setProductBase = (product) => {
        setState({
            productBase: product,
            totalPrice: product.basePrice,
            selectedIngredients: [],
            quantity: 1
        });
    };

    const addIngredient = (ingredient) => {
        setState(prev => {
            const newIngredients = [...prev.selectedIngredients, ingredient];
            const newPrice = prev.productBase.basePrice +
                newIngredients.reduce((sum, ing) => sum + ing.price, 0);
            return {
                ...prev,
                selectedIngredients: newIngredients,
                totalPrice: newPrice
            };
        });
    };

    const removeIngredient = (ingredientId) => {
        setState(prev => {
            const newIngredients = prev.selectedIngredients.filter(ing => ing.id !== ingredientId);
            const newPrice = prev.productBase.basePrice +
                newIngredients.reduce((sum, ing) => sum + ing.price, 0);
            return {
                ...prev,
                selectedIngredients: newIngredients,
                totalPrice: newPrice
            };
        });
    };

    const setQuantity = (qty) => {
        setState(prev => ({ ...prev, quantity: Math.max(1, qty) }));
    };

    const resetCreator = () => {
        setState({
            productBase: null,
            selectedIngredients: [],
            totalPrice: 0,
            quantity: 1
        });
    };

    return (
        <CreatorContext.Provider value={{
            ...state,
            setProductBase,
            addIngredient,
            removeIngredient,
            setQuantity,
            resetCreator
        }}>
            {children}
        </CreatorContext.Provider>
    );
};

export const useCreatorStore = () => {
    const context = useContext(CreatorContext);
    if (!context) {
        throw new Error('useCreatorStore must be used within CreatorProvider');
    }
    return context;
};