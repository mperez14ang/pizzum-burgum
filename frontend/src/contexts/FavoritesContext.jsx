import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {useAuth} from './AuthContext';
import {transformCreationData} from "../utils/parsers.jsx";
import {API_BASE_URL} from "../services/api.js";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { isAuthenticated, user, logout, tokenAuth } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const loadFavorites = useCallback(async () => {
        // Si no hay usuario autenticado, no cargar favoritos
        if (!isAuthenticated || !user || !user.token) {
            setFavorites([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/favorites/my`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    // Usuario no autenticado, limpiar favoritos
                    setFavorites([]);
                    return;
                }
                throw new Error('Error al cargar favoritos');
            }

            // Verificar si hay contenido antes de parsear
            const text = await response.text();
            let data = [];
            if (text && text.trim() !== '') {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('Error parsing favorites JSON:', e);
                }
            }

            setFavorites(data || []);
        } catch (err) {
            console.error('Error loading favorites:', err);
            setError(err.message);
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user]);

    const addCreation = async (transformedCreationData) => {
        if (!isAuthenticated || !user) {
            return {
                success: false,
                error: 'Debes iniciar sesión para crear'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/creation/v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(transformedCreationData)
            });

            // VALIDAR RESPUESTA
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error al crear creation:', errorText);
                throw new Error(`Error al crear creation: ${response.status}`);
            }

            const creation = await response.json();

            // VALIDAR QUE TENGA ID
            if (!creation || !creation.id) {
                throw new Error('La creation creada no tiene ID');
            }

            return { success: true, data: creation };

        } catch (err) {
            console.error('Error en addCreation:', err);
            return { success: false, error: err.message };
        }
    }

    const addToFavorites = async (creationData) => {
        // Validar autenticación
        if (!isAuthenticated || !user) {
            return {
                success: false,
                error: 'Debes iniciar sesión para guardar favoritos'
            };
        }

        try {
            setIsLoading(true);
            setError(null);

            // Transformar los datos al formato del backend
            const transformedCreation = transformCreationData(creationData);

            // 1️⃣ CREAR LA CREATION (ahora con validación)
            const creationResult = await addCreation(transformedCreation);

            // ✅ VALIDAR RESULTADO
            if (!creationResult.success) {
                return {
                    success: false,
                    error: creationResult.error || 'Error al crear la creation'
                };
            }

            const creation = creationResult.data;

            // 2️⃣ CREAR EL FAVORITO
            const payload = {
                clientEmail: user.email,
                creationsIds: [creation.id]
            };

            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error al crear favorito:', errorText);

                if (response.status === 401 || response.status === 403) {
                    return {
                        success: false,
                        error: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'
                    };
                }
                throw new Error(`Error al agregar a favoritos: ${response.status}`);
            }

            const data = await response.json();

            return { success: true, data };

        } catch (err) {
            console.error('Error en addToFavorites:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromFavorites = async (favoriteId) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar de favoritos');
            }

            setFavorites(prevFavorites => {
                return prevFavorites.filter(fav => fav.id !== favoriteId);
            });

            return { success: true };
        } catch (err) {
            console.error('Error removing from favorites:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };


    const isFavorite = (creationId) => {
        return favorites.includes(creationId);
    };


    const toggleFavorite = async (creationData) => {
        if (isFavorite(creationData.id)) {
            return await removeFromFavorites(creationData.id);
        } else {
            return await addToFavorites(creationData);
        }
    };

    const value = {
        favorites,
        isLoading,
        error,
        isAuthenticated,
        loadFavorites,
        addCreation,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};


export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
    }
    return context;
};
