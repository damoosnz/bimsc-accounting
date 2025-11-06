import { hf } from "../../../helper-functions/helper-functions.js"
import { fields } from "../../../helper-functions/knack-api/knack-api-fields.js"
import { catMethods } from "../methods/transaction-categpries-api-methods.js"

export async function runCategorisationRules(transactions, rulesRaw) {

    const globalRules = [
        {
            name: 'fee1',
            code: 'FEE',
            cat: rulesRaw.find(c => c.field_244_raw === 'FEE'),
            rule: (t) => {
                const wildCards = ['Wise Charges', 'Overseas ATM - Withdrawal - Fee', 'Foreign - Currency - Fee']
                const [typeId, typeName] = readKnackConn(t.type)
                const [partyId, partyName] = readKnackConn(t.party)
                const keys = [normTest(typeName), normTest(partyName), normTest(t.details)]
                return wildCards.some(wc => {
                    return keys.some(k => k.includes(normTest(wc)))
                })
            },
            trs: [],
        }
    ]

    const catParties = rulesRaw.map(c => ({
        id: c.id,
        partySet: new Set(c.field_296_raw.map(p => p.id)),
        changed: false
    }))

    const ruleSets = rulesRaw.map(c => ({
        id: c.id,
        code: c.field_244_raw,
        name: c.field_245_raw,
        rules: {
            trTypes: (t) => {
                const types = c.field_294_raw // conn
                if (types.length === 0) return false
                const [typeId, name] = readKnackConn(t.type)
                return types.some(item => typeId === item.id)
            },
            trParties: (t) => {
                const parties = c.field_296_raw // conn
                if (parties.length === 0) return false
                const [partyId, name] = readKnackConn(t.party)
                return parties.some(item => partyId === item.id)
            },
            // trDetails: (t) => {
            //     const details = c.field_295_raw // array
            //     if (details.length === 0) return false
            //     return details.some(d => d === t.details)
            // },
            trWildCards: (t) => {
                const wildCards = c.field_302_raw // conn
                if (wildCards.length === 0) return false
                const [typeId, typeName] = readKnackConn(t.type)
                const [partyId, partyName] = readKnackConn(t.party)
                const keys = [normTest(typeName), normTest(partyName), normTest(t.details)]
                const test = wildCards.some(w => {
                    // console.log('w',w)
                    const wc = normTest(w.identifier)
                    return keys.some(k => k.includes(wc))
                })
                // update the category party array to enrich the category model
                if (test) {
                    const catParty = catParties.find(cp => cp.id === c.id)
                    const sizeInit = catParty.partySet.size
                    catParty.partySet.add(partyId)
                    const sizeUpd = catParty.partySet.size
                    if (sizeUpd > sizeInit) catParty.changed = true
                }
                return test
            }
        },
        trs: []
    }))

    console.log('categories: ', ruleSets.map(r => r.code))

    for (const t of transactions) {

        // DATA NORMALISATION
        const tr = normaliseTransaction(t)
        t.categories = []

        // CHECK GLOBAL RULES
        let glTest = false
        for (const r of globalRules) {
            glTest = r.rule(tr)
            if (glTest) {
                r.trs.push(tr)
                t.categories.push({ code: r.code, id: r.cat.id })
                break
            }
        }
        if (glTest) continue

        // CHECK RULES SET
        for (const r of ruleSets) {
            let test = false
            for (const rr of Object.values(r.rules)) {
                test = test || rr(tr)
            }
            if (test === true) {
                t.categories.push({ code: r.code, id: r.id })
                r.trs.push(tr)
            }
        }
    }

    // LOGGING
    console.log('*****GLOBAL RULES')
    for (const r of globalRules) {
        console.log(`${r.code}: `, r.trs.length)
    }
    console.log('*****RULE SETS')
    for (const r of ruleSets) {
        if (r.trs.length > 0) console.log(`${r.code}: `, r.trs.length)
    }
    console.log('MULTI CAT: ', transactions.filter(t => t.categories.length > 1).length)
    // console.log('SAMPLE UPTR: ', transactions.filter(t => t.categories.length === 1)[12])

    // POST PROCESSING

    // UPDATE THE CATEGORIES PARTIES
    async function updateCatParties() {
        const recs = catParties
            .filter(cp => cp.changed === true)
            .map(cp => ({
                id: cp.id,
                field_296: Array.from(cp.partySet),
            }))
        console.log('CATEGORIES TO UPDATE', recs.length)
        const pl = hf.knAPI.PL.putMany('scene_80', 'view_153', recs)
        return await hf.knAPI.calls.putMany(pl)
    }
    await updateCatParties()

    // UPDATE THE TRANSACTION CATEGORIES
    const recs = transactions
        .filter(t => {
            if (t.categories.length === 0) return false
            if (t.field_288_raw.length === 0) return true
            const newCatsStr = t.categories.map(c => c.id).sort().join('_')
            const extCatsStr = t.field_288_raw.map(c => c.id).sort().join('_')
            return newCatsStr !== extCatsStr
        })
        .map(t => ({ id: t.id, field_288: t.categories.map(c => c.id) }))
    console.log('TRANSACTIONS TO UPDATE', recs.length)
    if (recs.length > 0) {
        const res = await catMethods.transactions.updateCategory(recs)
        return true
    } else {
        return false
    }


}

function readKnackConn(value) {
    return [value[0].id, value[0].identifier]
}

function normTest(string) {
    return string.toLowerCase().replace(/\s/g, '').replace(/'/g, '')
}

function normaliseTransaction(t) {
    return {
        id: t.id,
        // bank: t[fields.transactions.bank_269.raw],
        // account: t[fields.transactions.account_179.raw],
        // dir: t[fields.transactions.dir_181.raw],
        type: t[fields.transactions.trType_247.raw],
        party: t[fields.transactions.trParty_248.raw],
        details: t[fields.transactions.details_236.raw],
        // amount: t[fields.transactions.amount_172.raw],
        // currency: t[fields.transactions.currency_178.raw],
        // fy: t[fields.transactions.fy_237.raw],
        // json: JSON.parse(t.field_228_raw),
        extgCategories: t[fields.transactions.categories_288.raw]
    }
}





