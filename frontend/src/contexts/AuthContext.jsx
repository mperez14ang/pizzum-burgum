import {createContext, useContext, useEffect, useState} from 'react';
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenAuth, setTokenAuth] = useState(null);

    // Comprobar si hay un usuario guardado al cargar
    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    const token = userData.token;

                    const validator = await validate(token);

                    console.log(validator.verified);

                    if (validator.verified === true) {
                        setUser(userData);
                        setTokenAuth(token);
                        setIsAuthenticated(true);
                    } else {
                        setTokenAuth(null);
                        setIsAuthenticated(false);
                        toast.error("Invalid token " + token);
                    }

                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        checkUser();
    }, []);

    const addUser = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        setTokenAuth(userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || 'Error al iniciar sesión'
                };
            }

            return addUser(data);
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: 'Error de conexión. Intente nuevamente.' };
        }
    };

    const register = async (email, password, firstName, lastName, birthDate, dni) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    birthDate,
                    dni,
                    email,
                    password,
                    addresses: [],
                    favorites: [],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || 'Error al registrar usuario'
                };
            }

            return addUser(data);

        } catch (error) {
            console.error('Error en register:', error);
            return { success: false, error: 'Error de conexión. Intente nuevamente.' };
        }
    };

    const validate = async (token) => {
        if (!token) {
            return { verified: false, error: 'No hay token' };
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/v1/verify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                logout(); // Token invalido
                return { verified: false, error: 'Token inválido' };
            }

            console.log(data)

            return data;

        } catch (error) {
            console.error('Error validando token:', error);
            return { verified: false, error: 'Error de conexión' };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setTokenAuth(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        tokenAuth,
        login,
        logout,
        register,
        validate
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
