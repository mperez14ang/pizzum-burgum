import {AddToCartButton} from "./common/AddToCartButton.jsx";
import {Info, Trash2} from "lucide-react";
import {useAuth} from "../contexts/AuthContext.jsx";
import {handleAddFavoriteToCart} from "../utils/CartInteraction.jsx";
import {useCart} from "../contexts/CartContext.jsx";

export const FavoriteComponent = ({favorite, handleInfo, handleDelete}) => {
    const { isAuthenticated } = useAuth()
    const { itemCount, setCartItemCount } = useCart();

    return <div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Imagen */}
                <div className="relative h-40 overflow-hidden group" onClick={() => handleInfo(favorite)}>

                    <img
                        src={favorite.image}
                        alt={favorite.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Botón eliminar */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(favorite)
                        }}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 p-2 rounded-full transition shadow-md"
                        title="Eliminar de favoritos"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>

                    {/* Botón de información  */}
                    <button
                        onClick={() => handleInfo(favorite)}
                        className="absolute top-2 left-2 bg-white/90 hover:bg-blue-50 p-2 rounded-full transition shadow-md"
                        title="Ver información detallada"
                    >
                        <Info className="w-4 h-4 text-blue-600" />
                    </button>
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
                        <AddToCartButton
                            onClick={() => handleAddFavoriteToCart(favorite, isAuthenticated, itemCount, setCartItemCount)}
                            isAvailable={favorite.available}
                        />
                    </div>
                </div>
            </div>
    </div>
}