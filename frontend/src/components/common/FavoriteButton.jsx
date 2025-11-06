import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import toast from "react-hot-toast";


export const FavoriteButton = ({ creationData, size = 'md', className = '' }) => {
    const { isFavorite, toggleFavorite, isLoading } = useFavorites();
    const [isAnimating, setIsAnimating] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const favorite = creationData ? isFavorite(creationData.id) : false;

    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10'
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24
    };

    const handleClick = async (e) => {
        e.stopPropagation();

        if (!creationData) {
            toast.error("Debes crear una pizza o hamburguesa primero")
            return;
        }

        setLocalLoading(true);
        setIsAnimating(true);

        const result = await toggleFavorite(creationData);

        if (result.success) {
            setTimeout(() => setIsAnimating(false), 300);
        } else {
            toast.error(result.error || 'Error al actualizar favoritos')
            setIsAnimating(false);
        }

        setLocalLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={localLoading || isLoading}
            className={`
                ${sizes[size]}
                flex items-center justify-center
                rounded-full
                transition-all duration-200
                ${favorite
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
                }
                ${isAnimating ? 'scale-125' : 'scale-100'}
                ${localLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
            <Heart
                size={iconSizes[size]}
                fill={favorite ? 'currentColor' : 'none'}
                className={`transition-all ${isAnimating ? 'animate-pulse' : ''}`}
            />
        </button>
    );
};
