import {createContext, useContext, useEffect, useState} from 'react';
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import {API_BASE_URL, fetchFromAPI} from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenAuth, setTokenAuth] = useState(null);

    // Comprobar si hay un usuario guardado al cargar
    useEffect(() => {
        checkUser()
        setIsLoading(false);
    }, []);

    const checkUser = async (updateVars=true) => {
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
                if (updateVars){
                    setUser(userData);
                    setTokenAuth(token);
                    setIsAuthenticated(true);
                    setIsLoading(false);
                }
                return true;
            }
        } catch (error) {
            console.error('Error parsing stored user:', error);
            logout();
            return false;
        }
    };


    const addUser = (userData, logInAfter=true) => {
        if (logInAfter){
            setUser(userData);
            setIsAuthenticated(true);
            setTokenAuth(userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
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

    const login = async (email, password, logInAfter=true) => {
        setIsLoading(true)
        const data = await fetchFromAPI('/auth/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        console.log(data)

        if (data.error){
            toast.error(data.error)
            setIsLoading(false)
            return
        }

        setIsLoading(false)
        return addUser(data, logInAfter)
    };

    const register = async (email, password, firstName, lastName, birthDate, dni, logInAfter=true) => {
        setIsLoading(true)
        const data = await fetchFromAPI('/auth/v1/register', {
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
            })
        })

        if (data.error){
            toast.error(data.error)
            setIsLoading(false)
            return
        }

        setIsLoading(false)
        return addUser(data, logInAfter)
    };

    const changePassword = async (email, oldPassword, newPassword, passwordConfirmation) => {
        const data = await fetchFromAPI('/auth/v1/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                oldPassword,
                password: newPassword,
                passwordConfirmation
            })
        })

        if (data.error){
            toast.error(data.error)
        }
    };

    const validate = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/v1/verify`, {
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

    const updateUser = (updates) => {
        setUser(prev => {
            const updatedUser = { ...prev, ...updates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const value = {
        user,
        updateUser,
        isAuthenticated,
        isLoading,
        tokenAuth,
        login,
        logout,
        register,
        validate,
        checkUser,
        changePassword
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
