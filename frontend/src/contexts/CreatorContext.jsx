
import { createContext, useContext, useState } from 'react';

const CreatorContext = createContext();

export const CreatorProvider = ({ children }) => {
    const [creation, setCreation] = useState(null);

    const updateCreation = (newCreation) => {
        setCreation(newCreation);
    };

    const resetCreation = () => {
        setCreation(null);
    };

    const value = {
        creation,
        updateCreation,
        resetCreation
    };

    return (
        <CreatorContext.Provider value={value}>
            {children}
        </CreatorContext.Provider>
    );
};

export const useCreatorStore = () => {
    const context = useContext(CreatorContext);
    if (!context) {
        throw new Error('useCreatorStore debe usarse dentro de CreatorProvider');
    }
    return context;
};