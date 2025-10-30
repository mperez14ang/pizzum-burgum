import { Heart, ShoppingBag } from 'lucide-react';

export const SummaryActions = ({
                                   productConfig,
                                   favoriteName,
                                   onFavoriteNameChange,
                                   onSaveFavorite,
                                   onAddToCart,
                                   isSavingFavorite,
                                   isAuthenticated
                               }) => {
    return (
        <div className="space-y-3">
            {/* Botón de agregar al carrito */}
            <button
                onClick={onAddToCart}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
                <ShoppingBag size={20} />
                Agregar al Carrito
            </button>

            {/* Input para favoritos con botón de corazón */}
            <div className="relative">
                <input
                    type="text"
                    value={favoriteName}
                    onChange={(e) => onFavoriteNameChange(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && favoriteName.trim()) {
                            onSaveFavorite();
                        }
                    }}
                    placeholder={productConfig.placeholder}
                    className="w-full pl-4 pr-14 py-3 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-orange-600 transition text-gray-700 placeholder-gray-400"
                    maxLength={50}
                />
                <button
                    onClick={onSaveFavorite}
                    disabled={!favoriteName.trim() || isSavingFavorite}
                    className={`
                        absolute right-2 top-1/2 -translate-y-1/2
                        p-2 rounded-lg transition-all
                        ${favoriteName.trim() && !isSavingFavorite
                        ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-110'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                    `}
                    title={
                        !isAuthenticated
                            ? 'Inicia sesión para guardar favoritos'
                            : 'Presiona Enter o haz click aquí para guardar'
                    }
                >
                    {isSavingFavorite ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <Heart
                            size={20}
                            fill={favoriteName.trim() ? 'currentColor' : 'none'}
                        />
                    )}
                </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
                Escribe un nombre y presiona el ❤️ o Enter para guardar
            </p>
        </div>
    );
};