export function getViewCustomParams(view) {

    const description = view.description

    if (!description) return {};

    const parts = description.split('::');
    if (parts.length < 2) return {};

    const paramString = parts[1].trim();
    const params = {};

    paramString.split(',').forEach(pair => {
        const [key, value] = pair.split('=').map(s => s.trim());
        if (key && value !== undefined) {
            params[key] = value;
        }
    });

    return params;
}