import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    /**
     * Login simulado (en producción conectar con el backend)
     */
    const login = async (email, password) => {
        try {
            // Por ahora, login simulado
            const mockUser = {
                email: email,
                password: password, // TEMPORAL: Solo para desarrollo con Basic Auth
                firstName: 'Usuario',
                lastName: 'Demo',
                role: 'CLIENT'
            };

            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(mockUser));

            return { success: true, user: mockUser };
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: error.message };
        }
    };


    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
