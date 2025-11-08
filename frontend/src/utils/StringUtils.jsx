export const API_URL = "http://localhost:8080";

export const CATEGORY_IMAGES = {
    BEBIDA: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400',
    POSTRE: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    ACOMPANAMIENTO: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400',
    OTROS: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
};

export const getImage = (item, type, category) => {
    console.log(item);
    console.log(category)
    console.log(type)

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
    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.OTROS;
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