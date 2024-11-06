import { tr_types_map } from "../const/transaction_type-map.js";
import { knackApi } from "bimsc-knack-api";

$(document).on('knack-view-render.view_55', async function (event, view, data) {

    // list transactions types

    const payload_1 = knackApi.payloads.getMany('scene_31', 'view_53')
    const extg_tr_types = await knackApi.calls.getMany(payload_1)

    console.log('tr_types', extg_tr_types)

    // list transaction that are unprocessed

    const payload_2 = knackApi.payloads.getMany('scene_31', 'view_52')
    const unPro_trs = await knackApi.calls.getMany(payload_2)

    // console.log('unPro_trs', unPro_trs)

    // list new transaction types

    const unique_tr_types = listUniqueTrTypes(unPro_trs)
    // console.log('unique_tr_types', unique_tr_types)
    const new_tr_types = listNewTrTypes(extg_tr_types, unique_tr_types)
    // console.log('new_tr_types', new_tr_types)

    if (new_tr_types.length > 0) {
        const pck_new_tr_types = packageNewTrTypes(new_tr_types)
        // console.log('pck_new_tr_types', pck_new_tr_types)
        const payload_3 = knackApi.payloads.postMany('scene_31', 'view_54', pck_new_tr_types)
        const added_tr_types = await knackApi.calls.postMany(payload_3)
    }

    // update transaction config

    const filters = knackApi.filters.create('AND')
    const rule = { field: 'field_233', operator: 'is blank' }
    filters.rules.push(rule)
    const payload_4 = knackApi.payloads.getMany('scene_31', 'view_53', filters)
    const to_config_tr_types = await knackApi.calls.getMany(payload_4)
    console.log('to_config_tr_types', to_config_tr_types)

    const config_tr_types = configTrTypes(to_config_tr_types)
    console.log('config_tr_types', config_tr_types)

    const payload_5 = knackApi.payloads.putMany('scene_31', 'view_53', config_tr_types)
    const upd_config_tr_types = await knackApi.calls.putMany(payload_5)


});


function listUniqueTrTypes(records) {
    const uniqueTrTypes = records.reduce((acc, rec) => {
        const type = rec.field_176_raw; // transaction type
        const bankId = rec.field_229_raw[0]?.id; // bank id (ensure it's available)

        // Check if this type and bank combination has already been added
        if (!acc.some(
            item => (
                item.field_231_raw === type && // compare transaction type
                item.field_232_raw[0]?.id === bankId // compare bank id
            )
        )) {
            // Push the new unique combination of type and bank id
            acc.push({
                field_231_raw: type,
                field_232_raw: [{ id: bankId }] // correctly structure field_232_raw as an array
            });
        }

        return acc; // Return the updated accumulator
    }, []);

    return uniqueTrTypes;
}

function listNewTrTypes(extg_tr_types, uniq_tr_types) {
    const new_tr_types = uniq_tr_types.filter(typ => {
        return !extg_tr_types.some(
            extg_typ => (
                typ.field_232_raw[0]?.id === extg_typ.field_232_raw[0]?.id &&
                typ.field_231_raw === extg_typ.field_231_raw
            )
        );
    });
    return new_tr_types;
}

function packageNewTrTypes(new_tr_types) {

    const pck_new_tr_types = new_tr_types.map(
        typ => {
            return {
                field_231: typ.field_231_raw,
                field_232: typ.field_232_raw[0]?.id
            }
        }
    )
    return pck_new_tr_types

}

function configTrTypes(to_config_tr_types) {

    const result = []; // Initialize an empty result array

    for (let typ of to_config_tr_types) {
        // Get bank and type
        const bank = typ.field_232_raw[0]?.identifier;  // e.g., "WISE"
        const type = typ.field_231_raw;  // e.g., "MONEY_ADDED"

        // Find the corresponding mapping in tr_types_map
        const mapping = tr_types_map.find(item =>
            item.bank === bank.toUpperCase() && item.type === type
        );

        console.log('mapping', mapping)

        // If a mapping is found, assign it to field_233
        if (mapping) {
            result.push({
                id: typ.id,
                field_233: JSON.stringify(
                    {
                        party: mapping.party,
                        details: mapping.details
                    })
            })
        } else {
            // Fallback: Check if there's a default mapping for the bank (no specific type)
            const defaultMapping = tr_types_map.find(item =>
                item.bank === bank.toUpperCase() && item.type === ''
            );

            if (defaultMapping) {
                result.push({
                    id: typ.id,
                    field_233: JSON.stringify(
                        {
                            party: defaultMapping.party,
                            details: defaultMapping.details
                        })
                })
            } else {
                console.warn(`No mapping found for bank: ${bank}, type: ${type}`);
            }
        }
    }

    return result

}
