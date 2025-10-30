import {ChevronLeft, Heart, LucideBadgeInfo, Trash2} from 'lucide-react';
import {Header} from '../components/common/Header';
import {useFavorites} from '../contexts/FavoritesContext';
import React, {useEffect, useMemo, useState} from 'react';
import toast from 'react-hot-toast';
import {AddToCartButton} from "../components/common/AddToCartButton.jsx";
import FavoriteDetailModal from "./modals/FavoriteDetailModal.jsx";

export const FavoritesPage = ({ onNavigate, onBack }) => {
    const { favorites, isLoading, removeFromFavorites } = useFavorites();

    const [processed, setProcessed] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
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
                        creationCount: fav.creations.length
                    };
                })
                .filter(Boolean);

            setProcessed(processedFavorites);
        } else {
            setProcessed([]);
        }
    }, [favorites]);

    const handleInfo = (favoriteId) => {
        const fav = favorites?.find(f => f.id === favoriteId);
        if (fav) {
            setSelectedFavorite(fav);
            setIsDetailOpen(true);
        } else {
            toast.error('No se encontró el favorito seleccionado');
        }
    }

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
                            <div className="h-44 w-full overflow-hidden relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />

                                {/* Botón de información */}
                                <button
                                    onClick={() => handleInfo(item.favoriteId)}
                                    className="absolute top-2 left-2 bg-white/90 p-2 rounded-full hover:bg-red-50 transition"
                                    title="Información del favorito"
                                >
                                    <LucideBadgeInfo className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <span className="text-orange-600 font-bold">{'$' + item.price.toFixed(2)}</span>
                                </div>
                                {/* Se quita la línea de "Incluye n creación(es)" */}

                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleRemove(item.favoriteId)}
                                        className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Quitar
                                    </button>

                                    <AddToCartButton isAvailable={item.available} onClick={() => handleAddToCart(item)}/>
                                </div>
                            </div>
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

    const handleAddToCart = (favorite) => {
        // TODO: Integrar con carrito cuando esté disponible
        toast.success(`${favorite.name} agregado al carrito`, { duration: 2000 });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate} />

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
            <FavoriteDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                favorite={selectedFavorite}
            />
        </div>
    );
};

export default FavoritesPage;