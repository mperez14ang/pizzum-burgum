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