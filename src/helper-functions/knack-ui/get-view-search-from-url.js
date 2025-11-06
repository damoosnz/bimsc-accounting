export function getViewSearchFromUrl(view) {

    const hashParams = window.location.hash.split('?')[1];
    if (!hashParams) return null;

    const searchParams = new URLSearchParams(hashParams);
    const key = `${view.key}_search`;

    if (searchParams.has(key)) {
        try {
            const raw = searchParams.get(key);
            return decodeURIComponent(raw);
        } catch (e) {
            console.error(`Invalid search parameters [${key}]`, e);
            return null;
        }
    }
    return null;

}