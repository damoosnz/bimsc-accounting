import { getViewFiltersFromUrl } from "./get-view-filters-from-url.js";
import { hf } from "../helper-functions.js";

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

function resetFiltersTableView(view, newFilters) {

    if (!newFilters || !newFilters.match || newFilters.rules?.length === 0) {
        console.log('newFilters not correctly formatted')
        return
    }
    Knack.views[view.key].handleChangeFilters(newFilters);

}

function removeFiltersTableVIew(view) {
    Knack.views[view.key].handleChangeFilters({});
}

function normalizeFiltersTableView(view) {

    const defaultfilters = getViewFiltersFromUrl(view)
    const isArr = defaultfilters && Array.isArray(defaultfilters)
    if (isArr) {
        const normalisedFilters = hf.knAPI.filters.create('and')
        normalisedFilters.rules = defaultfilters
        Knack.views[view.key].handleChangeFilters(normalisedFilters)
        return true
    }
    return false

}

export function reRenderTableOrCalendar(viewKey) {
    var originalFilters = Knack.views[viewKey].getFilters();
    Knack.views[viewKey].handleChangeFilters(originalFilters)
}

export function reRenderDetailsView(viewKey) {
    Knack.views[viewKey].model.fetch();//get new data
    setTimeout(function () {//wait for the model data to return from the database?? This is required not exactly sure why
        Knack.views[viewKey].render();//re-render
        Knack.views[viewKey].postRender();//fix display issues
    }, 1000);
}

export function reRenderFormView(viewKey) {
    Knack.views[viewKey].render();
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
    getViewFiltersFromUrl,
    addFiltersToTab: (view, newFilter) => addFilterToTableView(view, newFilter),
    resetFiltersTab: (view, filters) => resetFiltersTableView(view, filters),
    normalizeFiltersTab : (view) => normalizeFiltersTableView(view),
    removeFilters: (view) => removeFiltersTableVIew(view),
    renderTabOrCal: (viewKey) => reRenderTableOrCalendar(viewKey),
    renderDet: (viewKey) => reRenderDetailsView(viewKey),
    renderForm: (viewKey) => reRenderFormView(viewKey),
}