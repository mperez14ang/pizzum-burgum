import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const loadFavorites = useCallback(async () => {
        console.log('📥 loadFavorites llamada');
        console.log('   isAuthenticated:', isAuthenticated);
        console.log('   user:', user);
        console.log('   user?.token:', user?.token ? 'exists' : 'null');

        // Si no hay usuario autenticado, no cargar favoritos
        if (!isAuthenticated || !user || !user.token) {
            console.log('⚠️ No se puede cargar favoritos - falta autenticación');
            setFavorites([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8080/api/favorites/my', {
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

            // Los datos vienen como un array de objetos Favorites
            console.log('✅ Favoritos cargados:', data?.length || 0);
            setFavorites(data || []);
        } catch (err) {
            console.error('Error loading favorites:', err);
            setError(err.message);
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user]);

    const transformCreationData = (creationData) => {
        const products = [];

        if (creationData.type === 'PIZZA') {
            // Para pizzas
            if (creationData.size) products.push({ quantity: 1, product: creationData.size.id });
            if (creationData.dough) products.push({ quantity: 1, product: creationData.dough.id });
            if (creationData.sauce) products.push({ quantity: 1, product: creationData.sauce.id });
            if (creationData.cheese) products.push({ quantity: 1, product: creationData.cheese.id });
            if (creationData.toppings) {
                creationData.toppings.forEach(topping => {
                    products.push({ quantity: 1, product: topping.id });
                });
            }
        } else if (creationData.type === 'HAMBURGER') {
            // Para hamburguesas
            if (creationData.bread) products.push({ quantity: 1, product: creationData.bread.id });
            if (creationData.meat) products.push({ quantity: creationData.meatQuantity || 1, product: creationData.meat.id });
            if (creationData.cheese) products.push({ quantity: 1, product: creationData.cheese.id });
            if (creationData.toppings) {
                creationData.toppings.forEach(topping => {
                    products.push({ quantity: 1, product: topping.id });
                });
            }
            if (creationData.sauces) {
                creationData.sauces.forEach(sauce => {
                    products.push({ quantity: 1, product: sauce.id });
                });
            }
        }

        return {
            name: creationData.name,
            type: creationData.type,
            price: creationData.price,
            products: products
        };
    };


    const addToFavorites = async (creationData) => {
        // Validar autenticación
        if (!isAuthenticated || !user) {
            return {
                success: false,
                error: 'Debes iniciar sesión para guardar favoritos',
                needsAuth: true
            };
        }

        try {
            setIsLoading(true);
            setError(null);

            // Transformar los datos al formato del backend
            const transformedCreation = transformCreationData(creationData);

            // Crear el payload para el backend
            const payload = {
                clientEmail: user.email,
                creations: [transformedCreation]
            };

            console.log('Payload enviado al backend:', JSON.stringify(payload, null, 2));

            const response = await fetch('http://localhost:8080/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    return {
                        success: false,
                        error: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
                        needsAuth: true
                    };
                }
                throw new Error('Error al agregar a favoritos');
            }

            const data = await response.json();

            setFavorites(prev => [...prev, data]);

            return { success: true, data };
        } catch (err) {
            console.error('Error adding to favorites:', err);
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

            const response = await fetch(`http://localhost:8080/api/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar de favoritos');
            }

            // Recargar favoritos del backend después de eliminar
            await loadFavorites();

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

    useEffect(() => {
        console.log('🔄 FavoritesContext useEffect disparado');
        console.log('   isAuthenticated:', isAuthenticated);
        console.log('   user:', user);
        console.log('   user?.email:', user?.email);
        console.log('   user?.token:', user?.token ? 'exists' : 'null');

        if (isAuthenticated && user && user.token) {
            console.log('✅ Condiciones cumplidas - Llamando loadFavorites para:', user.email);
            loadFavorites();
        } else {
            console.log('❌ Condiciones NO cumplidas - Limpiando favoritos');
            setFavorites([]);
        }
    }, [isAuthenticated, user, loadFavorites]);

    const value = {
        favorites,
        isLoading,
        error,
        isAuthenticated,
        loadFavorites,
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
