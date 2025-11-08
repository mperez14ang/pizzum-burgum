export const API_URL = "http://localhost:8080";

export const CATEGORY_IMAGES = {
    BEVERAGE: `${API_URL}/assets/beverage.jpeg`,
    DESSERT: `${API_URL}/assets/dessert.jpeg`,
    SIDE: `${API_URL}/assets/side.jpeg`,
    OTHER: `${API_URL}/assets/other.jpeg`
};

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
        return `${API_URL}/assets/pizza.jpg`;
    }

    if (type === 'HAMBURGER') {
        return `${API_URL}/assets/burger.jpg`;
    }

    return '/placeholder.png';
};

export const getExtraImage = (category) => {
    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.OTHER;
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