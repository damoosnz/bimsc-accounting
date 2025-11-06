import { hf } from "../../../helper-functions/helper-functions.js";

export const catMethods = {
    transactions: {
        updateCategory: updateTransactionCategories
    },
    categories: {
        get: getCats,
        updateParties: updCatparties,
        updateHints: updCatHints,
        addHint: addCatHint
    },
    hints: {
        add: addCategoryHint,
        getFromCats: getHintsFromCategories,
    }
}

// CATEGORIES
async function getCats() {
    const pl = hf.knAPI.PL.getMany({ s: 'scene_66', v: 'view_127' })
    return await hf.knAPI.calls.getMany(pl)
}
async function updCatparties(recId, recData) {
    const pl = hf.knAPI.PL.putSingle('scene_80', 'view_153', recId, recData)
    return await hf.knAPI.calls.putSingle(pl)
}
async function updCatHints(catId, hints) {
    const cfg = { s: 'scene_80', v: 'view_152' }
    const pl = hf.knAPI.PL.putSingle(cfg.s, cfg.v, catId, { field_302: hints })
    return await hf.knAPI.calls.putSingle(pl)
}
async function addCatHint(cat, hint) {
    const hints = [...cat.field_302_raw.map(h => h.id), hint.id]
    return await updCatHints(cat.id, hints)
}
// CATEGORIES
async function updateTransactionCategories(recs) {
    const cfg = { s: 'scene_77', v: 'view_147' }
    const pl = hf.knAPI.PL.putMany(cfg.s, cfg.v, recs)
    return await hf.knAPI.calls.putMany(pl)
}

// HINTS
async function addCategoryHint(hint) {
    const cfg = { s: 'scene_76', v: 'view_148' }
    const pl = hf.knAPI.PL.postSingle(cfg.s, cfg.v, { field_299: hint })
    const res = await hf.knAPI.calls.postSingle(pl)
    return res.record
}
function getHintsFromCategories(cats) {
    const hints = []
    for (const c of cats) {
        const cHints = c.field_302_raw // array
        if (cHints.length === 0) continue
        for (const ch of cHints) {
            hints.push({
                id: ch.id,
                identifier: ch.identifier,
                catId: c.id,
                catCode: c.field_244_raw
            })
        }
    }
    return hints
}