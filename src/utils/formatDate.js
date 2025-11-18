/**
 * @param {string|Date} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    const formatted = new Intl.DateTimeFormat('es-AR', options).format(date);
    return formatted.replace(',', ' a las');
}

/**
 * @param {string|Date} dateString
 * @returns {string}
 */
export function formatRelativeDate(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Hace unos segundos';
    if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return `Ayer a las ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} hs`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''} a las ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} hs`;

    return formatDate(dateString);
}
