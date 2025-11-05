import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { cartService } from "../services/api.js";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, isAuthenticated, isLoading:isAuthLoading } = useAuth();

    const [cartItems, setCartItems] = useState([]);

    // Cargar el contador desde localStorage al iniciar
    const [itemCount, setItemCount] = useState(() => {
        const saved = localStorage.getItem("cartCount");
        return saved ? parseInt(saved) : 0;
    });

    // Sincronizar con localStorage
    const setCartItemCount = (value) => {
        setItemCount(value);
        localStorage.setItem("cartCount", value.toString());
    };

    // Si se loguea
    useEffect( () => {
        if (isAuthenticated){
            loadUserCart()
        }
    }, [isAuthLoading])

    // Actualizar el contador cuando cambian los items
    useEffect(() => {
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(count);
    }, [cartItems]);

    const loadUserCart = async () => {
        console.log("init cart provider " + localStorage.getItem("cartCount"));

        if (isAuthenticated && user) {
            try {
                if (!user.cartItems) {
                    const activeCart = await cartService.getActiveCart();

                    const items = activeCart?.items || [];

                    setCartItems(Array.isArray(items) ? items : []);
                } else {
                    setCartItems(Array.isArray(user.cartItems) ? user.cartItems : []);
                }
            } catch (error) {
                console.error("Error cargando carrito:", error);
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, itemCount, setCartItemCount, loadUserCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
};