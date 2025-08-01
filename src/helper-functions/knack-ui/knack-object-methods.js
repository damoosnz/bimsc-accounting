import { getViewFiltersFromUrl } from "./get-view-filters-from-url.js";

export function addFilterToTableView(view, newFilters) {

    if (!newFilters || !newFilters.match || newFilters.rules?.length === 0) {
        console.log('newFilters not correctly formatted')
        return
    }

    // const extgFilters = Knack.views[view.key].getFilters();
    const retrievedFilters = getViewFiltersFromUrl(view)

    if (!retrievedFilters) {
        Knack.views[view.key].handleChangeFilters(newFilters);
        return
    }

    let extgFilters

    // manage the default filter that return just a rule array

    if (Array.isArray(retrievedFilters)) {
        extgFilters = {
            match: newFilters.match,
            rules: retrievedFilters
        }
    } else {
        extgFilters = retrievedFilters
    }

    if (extgFilters.match !== newFilters.match) {
        console.log(`cannot mixe extgFilters '${extgFilters.match}' with newFiilters '${newFilters.match}'`)
        return
    }

    // check that the newFilters are bringing new rules
    const extgRules = extgFilters.rules
    const newRules = newFilters.rules

    function deepSortObject(obj) {
        const excludeKeys = ['val_label', 'field_name'];

        if (Array.isArray(obj)) {
            return obj.map(deepSortObject);
        } else if (obj && typeof obj === 'object') {
            return Object.keys(obj)
                .filter(key => !excludeKeys.includes(key))
                .sort()
                .reduce((acc, key) => {
                    acc[key] = deepSortObject(obj[key]);
                    return acc;
                }, {});
        }
        return obj;
    }

    function normalizeRule(rule) {
        return JSON.stringify(deepSortObject(rule));
    }

    const extRulesStr = extgRules.map(r => normalizeRule(r))
    const newUniqueRules = newRules.filter(r => {
        const rStr = normalizeRule(r)
        return !extRulesStr.includes(rStr)
    })

    if (newUniqueRules.length === 0) {
        // console.log('no new rules in the newFilters')
        return
    }

    // combine the the rules array
    const combinedRules = [...extgRules, ...newUniqueRules]
    extgFilters.rules = combinedRules

    Knack.views[view.key].handleChangeFilters(extgFilters);

}

export function reRenderTableOrCalendar(viewKey) {
    var originalFilters = JSON.stringify(Knack.views[viewKey].getFilters());
    Knack.views[viewKey].handleChangeFilters(originalFilters)
}

export function reRenderDetailsView(viewKey) {
    Knack.views[viewKey].model.fetch();//get new data
    setTimeout(function () {//wait for the model data to return from the database?? This is required not exactly sure why
        Knack.views[viewKey].render();//re-render
        Knack.views[viewKey].postRender();//fix display issues
    }, 1000);
}

function getUniqueRules(rules1, rules2) {
    const all = [...rules1, ...rules2];
    const seen = new Set();

    return all.filter(rule => {
        // Sort the entries to make key order-independent
        const entries = Object.entries(rule).sort(([a], [b]) => a.localeCompare(b));
        const key = JSON.stringify(entries);

        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export const manipViews = {
    addFiltersToTab: (view, newFilter) => addFilterToTableView(view, newFilter),
    renderTabOrCal: (viewKey) => reRenderTableOrCalendar(viewKey),
    renderDet: (viewKey) => reRenderDetailsView(viewKey)
}