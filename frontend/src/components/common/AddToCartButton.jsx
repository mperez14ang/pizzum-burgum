import toast from "react-hot-toast";
import {ShoppingBag} from "lucide-react";

export const AddToCartButton = ({ isAvailable, onClick }) => {
    return (
        <button
            onClick={() => {
                if (isAvailable) onClick();
                else toast.error("Esta creación no está disponible");
            }}
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition ${
                isAvailable
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!isAvailable}
        >
            <ShoppingBag size={16} />
            {isAvailable ? "Agregar" : "No disponible"}
        </button>
    );
};
