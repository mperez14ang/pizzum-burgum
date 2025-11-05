import {useEffect, useState} from 'react';
import {ArrowRight, ChevronLeft, ChevronRight, Heart, LogIn} from 'lucide-react';
import {useFavorites} from '../contexts/FavoritesContext';
import {useAuth} from '../contexts/AuthContext';
import {FavoriteComponent} from "./FavoriteComponent.jsx";
import FavoriteDetailModal from "../pages/modals/FavoriteDetailModal.jsx";
import {handleAddFavoriteToCart} from "../utils/CartInteraction.jsx";
import {useCart} from "../contexts/CartContext.jsx";

export const FavoritesCarousel = ({ onOpenLogin, onNavigateToFavorites, carouselLength = 5 }) => {
    const { favorites, loadFavorites, isLoading } = useFavorites();
    const { isAuthenticated, isLoading:authIsLoading } = useAuth();
    const { itemCount, setCartItemCount } = useCart();
    const [favoritesData, setFavoritesData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsVisible, setItemsVisible] = useState(3);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedFavorite, setSelectedFavorite] = useState(null);

    useEffect(() => {
        if (isAuthenticated && !authIsLoading){
            loadFavorites();
        }
    }, [authIsLoading]);

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
            const processedFavorites = favorites.map(fav => {
                const firstCreation = fav.creations && fav.creations.length > 0
                    ? fav.creations[0]
                    : null;

                if (!firstCreation) return null;

                const totalPrice = fav.creations.reduce((sum, creation) => sum + (creation.price || 0), 0);

                return {
                    favoriteId: fav.id,
                    id: firstCreation.id,
                    name: firstCreation.name || 'Sin nombre',
                    type: firstCreation.type,
                    price: totalPrice,
                    image: firstCreation.type === 'PIZZA'
                        ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
                        : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                    description: `${firstCreation.type === 'PIZZA' ? 'Pizza' : 'Hamburguesa'} personalizada`,
                    creationCount: fav.creations.length,
                    available: fav.available,
                    selections: firstCreation.selections,
                    creationId: firstCreation.id,
                    creations: fav.creations
                };
            }).filter(Boolean);

            setFavoritesData(processedFavorites);
        } else {
            setFavoritesData([]);
        }
    }, [favorites]);

    const totalFavorites = favoritesData.length;
    const hasMoreFavorites = totalFavorites > (carouselLength + 1);

    const displayFavorites = hasMoreFavorites
        ? favoritesData.slice(0, carouselLength - 1)
        : favoritesData;

    const totalItems = hasMoreFavorites ? carouselLength : totalFavorites;
    const maxIndex = Math.max(0, totalItems - itemsVisible);

    const handleInfo = (favorite) => {
        setSelectedFavorite(favorite);
        setShowInfoModal(true);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };


    // Si el usuario no está autenticado
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

    // Si no hay favoritos
    if (totalFavorites === 0 && !isLoading) {
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
        <>
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

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out gap-6"
                            style={{
                                transform: `translateX(-${currentIndex * (102 / itemsVisible)}%)`
                            }}
                        >
                            {displayFavorites.map((favorite) => (
                                <div
                                    key={favorite.favoriteId}
                                    className="flex-shrink-0"
                                    style={{ width: `calc(${100 / itemsVisible}% - ${(itemsVisible - 1) * 24 / itemsVisible}px)` }}
                                >
                                    <FavoriteComponent
                                        favorite={favorite}
                                        handleInfo={handleInfo}
                                    />
                                </div>
                            ))}

                            {/* Tarjeta "Ver Todos" - solo si hay más favoritos */}
                            {hasMoreFavorites && (
                                <div
                                    className="flex-shrink-0"
                                    style={{ width: `calc(${100 / itemsVisible}% - ${(itemsVisible - 1) * 24 / itemsVisible}px)` }}
                                >
                                    <button
                                        onClick={onNavigateToFavorites}
                                        className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col items-center justify-center text-white p-8 group w-full"
                                    >
                                        <div className="bg-white bg-opacity-20 rounded-full p-6 mb-4 group-hover:bg-opacity-30 group-hover:scale-110 transition-all duration-300">
                                            <Heart size={48} className="text-white" fill="white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">Ver Todos</h3>
                                        <p className="text-white text-opacity-90 mb-4 text-center group-hover:scale-105 transition-transform duration-300">
                                            Tienes otros {totalFavorites - (carouselLength - 1)} favoritos guardados
                                        </p>
                                        <div className="flex items-center gap-2 text-lg font-semibold">
                                            <span>Explorar</span>
                                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                                        </div>
                                    </button>
                                </div>
                            )}
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

            {/* Modal de información */}
            <FavoriteDetailModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                favorite={selectedFavorite}
                onOrder={() => handleAddFavoriteToCart(selectedFavorite, isAuthenticated, itemCount, setCartItemCount)}
            />
        </>
    );
};