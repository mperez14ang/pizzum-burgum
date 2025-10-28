import {createContext, useContext, useEffect, useState} from 'react';
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenAuth, setTokenAuth] = useState(null);

    // Comprobar si hay un usuario guardado al cargar
    useEffect(() => {
        checkUser().then(r => {})
        setIsLoading(false);
    }, []);

    const checkUser = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setIsLoading(false);
            return false;
        }

        try {
            const userData = JSON.parse(storedUser);
            const token = userData.token;

            // Check if token is expired
            if (isTokenExpired(token)) {
                // Verify with server
                const validator = await validate(token);

                if (validator.verified === true) {
                    setUser(userData);
                    setTokenAuth(token);
                    setIsAuthenticated(true);
                    return true;
                } else {
                    logout();
                    toast.error("Tu sesión ha vencido");
                    return false;
                }
            } else {
                // Token is valid locally
                setUser(userData);
                setTokenAuth(token);
                setIsAuthenticated(true);
                return true;
            }
        } catch (error) {
            console.error('Error parsing stored user:', error);
            logout();
            return false;
        }
    };


    const addUser = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        setTokenAuth(userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
    };

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;
            return decoded.exp < now;
        } catch (e) {
            return true;
        }
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
        try {
            const response = await fetch('http://localhost:8080/api/auth/v1/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return { verified: false };
            return await response.json();
        } catch (error) {
            console.error('Error validando token:', error);
            return { verified: false };
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
        validate,
        checkUser
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
