export const fasElSty = {
    $card: (es) => ({
        backgroundColor: es.bg,
        color: es.fg,
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '20px',
    }),
    $container: (es) => ({
        border: `5px solid ${es.bg}`,
        color: es.fg,
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: `0 1px 6px 0 ${hexToRgba(es.bg, 0.3)}`,
        marginBottom: '20px'
    }),
    $button: (es) => ({
        backgroundColor: es.bg,
        color: es.fg,
    }),
    $overlay: (es) => ({
        backgroundColor: `${hexToRgba(es.bg, 0.8)}`,
        color: es.fg,
        borderRadius: '8px',
        padding: '1rem'
    }),
    $icon: (es) => ({
        color: es.bg,
    })
}

function hexToRgba(hex, alpha = 1) {
    // Remove "#" if present
    hex = hex.replace(/^#/, '');

    // Support short hex (#abc)
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

