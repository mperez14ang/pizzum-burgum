import {ChevronLeft, Heart} from 'lucide-react';
import {Header} from '../components/common/Header';
import {useFavorites} from '../contexts/FavoritesContext';
import React, {useEffect, useMemo, useState} from 'react';
import toast from 'react-hot-toast';
import {FavoriteComponent} from "../components/FavoriteComponent.jsx";
import {useAuth} from "../contexts/AuthContext.jsx";
import FavoriteDetailModal from "./modals/FavoriteDetailModal.jsx";
import {handleAddFavoriteToCart} from "../utils/CartInteraction.jsx";
import {useCart} from "../contexts/CartContext.jsx";

export const FavoritesPage = ({ onNavigate, onBack }) => {
    const { favorites, isLoading, removeFromFavorites } = useFavorites();
    const { isAuthenticated } = useAuth()
    const { itemCount, setCartItemCount } = useCart();

    const [processed, setProcessed] = useState([]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedFavorite, setSelectedFavorite] = useState(null);

    useEffect(() => {
        if (favorites && favorites.length > 0) {
            const processedFavorites = favorites
                .map(fav => {
                    const firstCreation = fav.creations && fav.creations.length > 0
                        ? fav.creations[0]
                        : null;

                    if (!firstCreation) return null;

                    const totalPrice = fav.creations.reduce((sum, creation) => sum + (creation.price || 0), 0);

                    return {
                        favoriteId: fav.id,
                        id: firstCreation.id,
                        name: firstCreation.name || 'Sin nombre',
                        type: firstCreation.type, // 'PIZZA' | 'HAMBURGER'
                        price: totalPrice,
                        image: firstCreation.type === 'PIZZA'
                            ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop'
                            : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
                        description: `${firstCreation.type === 'PIZZA' ? 'Pizza' : 'Hamburguesa'} personalizada`,
                        creationCount: fav.creations.length,
                        available: fav.available,
                        selections: firstCreation.selections,
                        creationId: firstCreation.id,
                        creations: fav.creations // ✅ Agregar las creations completas para el modal
                    };
                })
                .filter(Boolean);

            setProcessed(processedFavorites);
        } else {
            setProcessed([]);
        }
    }, [favorites]);

    const handleInfo = (favorite) => {
        setSelectedFavorite(favorite);
        setShowInfoModal(true);
    };

    // Listas por categoría, ordenadas alfabéticamente
    const pizzas = useMemo(
        () => processed
            .filter(p => p.type === 'PIZZA')
            .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' })),
        [processed]
    );
    const burgers = useMemo(
        () => processed
            .filter(p => p.type === 'HAMBURGER')
            .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' })),
        [processed]
    );

    const Section = ({ title, items }) => (
        <section className="mb-12">

            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-orange-500 rounded" />
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            </div>

            {items.length === 0 ? (
                <p className="text-gray-500">No hay favoritos en esta categoría.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.favoriteId} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                            <FavoriteComponent
                                favorite={item}
                                handleInfo={handleInfo}
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );

    const handleRemove = async (favoriteId) => {
        if (confirm('¿Eliminar este favorito?')) {
            const result = await removeFromFavorites(favoriteId);
            if (!result.success) {
                toast.error('Error al eliminar: ' + (result.error || 'Intenta de nuevo'), { duration: 2000 });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <button
                    onClick={onBack}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ChevronLeft size={20}/>
                    <span className="ml-1">Volver</span>
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="text-red-500" size={32} fill="currentColor" />
                        Mis Favoritos
                    </h2>
                    <p className="text-gray-600 mt-2">Tus obras de arte, listas para ordenar</p>
                </div>

                {isLoading ? (
                    <div className="py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando favoritos...</p>
                        </div>
                    </div>
                ) : processed.length === 0 ? (
                    <div className="py-12">
                        <div className="text-center bg-gray-50 rounded-lg p-8">
                            <Heart size={48} className="mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes favoritos aún</h3>
                            <p className="text-gray-600">Crea una pizza o hamburguesa personalizada y guárdala como favorita</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <Section title="Pizza" items={pizzas} />
                        <Section title="Hamburguesa" items={burgers} />
                    </div>
                )}
            </main>
            {/* Modal de información */}
            <FavoriteDetailModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                favorite={selectedFavorite}
                onOrder={() => handleAddFavoriteToCart(items, isAuthenticated, itemCount, setCartItemCount)}
            />
        </div>
    );
};

export default FavoritesPage;