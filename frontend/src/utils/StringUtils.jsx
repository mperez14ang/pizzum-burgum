import {BEVERAGE_IMAGE, BURGER_IMAGE, DESSERT_IMAGE, OTHER_IMAGE, PIZZA_IMAGE, SIDE_IMAGE} from "./assets.jsx";

export const CATEGORY_IMAGES = {
    BEVERAGE: BEVERAGE_IMAGE,
    DESSERT: DESSERT_IMAGE,
    SIDE: SIDE_IMAGE,
    OTHER: OTHER_IMAGE
};

export const API_URL = import.meta.env.PROD
    ? window.location.origin
    : "http://localhost:8080";

export const getImage = (item, type, category) => {
    if (type === 'EXTRA') {
        if (item.image && item.image !== '') {
            if (item.image.startsWith('/')) {
                return `${item.image.startsWith('/') ? item.image.slice(1) : item.image}`;
            }
            return item.image;
        }
        return getExtraImage(category);
    }

    if (type === 'PIZZA') {
        return PIZZA_IMAGE;
    }

    if (type === 'HAMBURGER') {
        return BURGER_IMAGE;
    }

    return '/placeholder.png';
};

export const getExtraImage = (category) => {
    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.OTHER;
};

export const ORDER_STATE_COLORS = {
    UNPAID: 'warning',
    IN_QUEUE: 'info',
    MAKING: 'primary',
    DELIVERING: 'info',
    DELIVERED: 'success',
    CANCELLED: 'danger'
};

export const ORDER_STATE_LABELS = {
    UNPAID: 'Sin pagar',
    IN_QUEUE: 'En cola',
    MAKING: 'Preparando',
    DELIVERING: 'En camino',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado'
};

export function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatDateToSpanish = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    // Opciones para formato español
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('es-ES', options);
};
