import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Trash2, LogIn } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import toast from "react-hot-toast";

export const FavoritesCarousel = ( { onOpenLogin } ) => {
    const { favorites, loadFavorites, removeFromFavorites, isLoading } = useFavorites();
    const { isAuthenticated } = useAuth();
    const [favoritesData, setFavoritesData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);

    const [itemsVisible, setItemsVisible] = useState(3);

    // Responsive: ajustar items visibles según el tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setItemsVisible(1);
            } else if (width < 1024) {
                setItemsVisible(2);
            } else {
                setItemsVisible(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (favorites && favorites.length > 0) {
            console.log('Favoritos recibidos del backend:', favorites);

            const processedFavorites = favorites.map(fav => {
                console.log('Procesando favorito completo:', JSON.stringify(fav, null, 2)); // 🔍 VER TODO

                const firstCreation = fav.creations && fav.creations.length > 0
                    ? fav.creations[0]
                    : null;

                if (!firstCreation) return null;

                const totalPrice = fav.creations.reduce((sum, creation) => sum + (creation.price || 0), 0);

                const processed = {
                    favoriteId: fav.id,
                    id: firstCreation.id,
                    name: firstCreation.name || 'Sin nombre',
                    type: firstCreation.type,
                    price: totalPrice,
                    image: firstCreation.type === 'PIZZA'
                        ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
                        : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                    description: `${firstCreation.type === 'PIZZA' ? 'Pizza' : 'Hamburguesa'} personalizada`,
                    creationCount: fav.creations.length
                };

                console.log('Favorito procesado:', processed); // 🔍 VER EL PROCESADO
                return processed;
            }).filter(Boolean);

            console.log('Favoritos procesados (final):', processedFavorites);
            setFavoritesData(processedFavorites);
        } else {
            setFavoritesData([]);
        }
    }, [favorites]);

    const totalItems = favoritesData.length;
    const maxIndex = Math.max(0, totalItems - itemsVisible);

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleRemove = async (favoriteId) => {
        console.log('🗑️ handleRemove llamado con favoriteId:', favoriteId); // 🔍 DEBUG

        if (confirm('¿Eliminar este favorito?')) {
            const result = await removeFromFavorites(favoriteId);
            if (result.success) {
                console.log('✅ Favorito eliminado exitosamente');
                // Ya no necesitas actualizar manualmente porque loadFavorites() se encarga
            } else {
                toast.error('Error al eliminar: ' + (result.error || 'Intenta de nuevo'), { duration: 2000 });
            }
        }
    };

    const handleAddToCart = (favorite) => {
        console.log('Agregando al carrito:', favorite);
        toast.success(`${favorite.name} agregado al carrito`, { duration: 2000 })
    };

    // Si el usuario no está autenticado, mostrar prompt de login
    if (!isAuthenticated) {
        return (
            <div className="py-12">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
                        <Heart className="text-orange-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Guarda tus Favoritos
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Inicia sesión para guardar tus creaciones favoritas y acceder a ellas en cualquier momento
                    </p>
                    <button
                        onClick={onOpenLogin}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold inline-flex items-center gap-2"
                    >
                        <LogIn size={20} />
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    // Si no hay favoritos, mostrar mensaje
    if (totalItems === 0 && !isLoading) {
        return (
            <div className="py-12">
                <div className="text-center bg-gray-50 rounded-lg p-8">
                    <Heart size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        No tienes favoritos aún
                    </h3>
                    <p className="text-gray-600">
                        Crea una pizza o hamburguesa personalizada y guárdala como favorita
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando favoritos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            {/* Título de la sección */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="text-red-500" size={32} fill="currentColor" />
                    Tus Favoritos
                </h2>
                <p className="text-gray-600 mt-2">
                    Tus creaciones guardadas listas para ordenar
                </p>
            </div>

            {/* Carrusel */}
            <div className="relative px-12">
                {/* Botones de navegación */}
                {totalItems > itemsVisible && (
                    <>
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className={`
                                absolute left-0 top-1/2 -translate-y-1/2 z-10
                                bg-white rounded-full p-3 shadow-lg
                                transition-all duration-200
                                ${currentIndex === 0
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-orange-50 hover:scale-110'
                                }
                            `}
                        >
                            <ChevronLeft size={24} className="text-gray-700" />
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= maxIndex}
                            className={`
                                absolute right-0 top-1/2 -translate-y-1/2 z-10
                                bg-white rounded-full p-3 shadow-lg
                                transition-all duration-200
                                ${currentIndex >= maxIndex
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-orange-50 hover:scale-110'
                                }
                            `}
                        >
                            <ChevronRight size={24} className="text-gray-700" />
                        </button>
                    </>
                )}

                {/* Contenedor del carrusel */}
                <div className="overflow-hidden" ref={carouselRef}>
                    <div
                        className="flex transition-transform duration-500 ease-in-out gap-6"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsVisible)}%)`
                        }}
                    >
                        {favoritesData.map((favorite) => (
                            <div
                                key={favorite.id}
                                className="flex-shrink-0"
                                style={{ width: `calc(${100 / itemsVisible}% - ${(itemsVisible - 1) * 24 / itemsVisible}px)` }}
                            >
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                    {/* Imagen */}
                                    <div className="relative h-40 overflow-hidden group">
                                        <img
                                            src={favorite.image}
                                            alt={favorite.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                        {/* Botón eliminar */}
                                        <button
                                            onClick={() => handleRemove(favorite.favoriteId)}
                                            className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-red-50 transition"
                                            title="Eliminar de favoritos"
                                        >
                                            <Heart size={16} className="text-red-500" fill="currentColor" />
                                        </button>

                                        {/* Badge del tipo */}
                                        <div className="absolute bottom-2 left-2">
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-semibold text-white
                                                ${favorite.type === 'PIZZA' ? 'bg-orange-500' : 'bg-yellow-600'}
                                            `}>
                                                {favorite.type === 'PIZZA' ? '🍕' : '🍔'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {favorite.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 flex-grow">
                                            {favorite.description}
                                        </p>

                                        {/* Precio y botón */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-orange-500">
                                                    ${favorite.price}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(favorite)}
                                                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 text-sm"
                                            >
                                                <ShoppingCart size={16} />
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Indicadores de página */}
                {totalItems > itemsVisible && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`
                                    h-2 rounded-full transition-all duration-300
                                    ${currentIndex === idx
                                        ? 'bg-orange-500 w-8'
                                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                                    }
                                `}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
