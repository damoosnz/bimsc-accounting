export function getViewFiltersFromUrl(view = null, reportIndex = 0) {
    const hashParams = window.location.hash.split('?')[1];
    if (!hashParams) return view ? null : {};

    const searchParams = new URLSearchParams(hashParams);
    const allFilters = {};

    if (view) {
        let key = `${view.key}_filters`;
        if (view.type === 'report') {
            key = `${view.key}_${reportIndex}_filters`;
        }

        if (searchParams.has(key)) {
            try {
                const raw = searchParams.get(key);
                return JSON.parse(decodeURIComponent(raw));
            } catch (e) {
                console.error(`Invalid JSON for filters [${key}]`, e);
                return null;
            }
        }
        return null;
    }

    // If no specific view is passed, return ALL view_*filters
    for (const [key, val] of searchParams.entries()) {
        if (/^view_\w+(_\d+)?_filters$/.test(key)) {
            try {
                allFilters[key] = JSON.parse(decodeURIComponent(val));
            } catch (e) {
                console.error(`Invalid JSON for filters [${key}]`, e);
            }
        }
    }

    return allFilters;
}



