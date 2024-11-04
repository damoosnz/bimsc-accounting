import { knackApi } from 'https://damoosnz.github.io/bimsc-knack-api/dist/bundle.js';

// view_55

$(document).on('knack-view-render.view_55', async function (event, view, data) {

    // list transactions types

    const payload_1 = knackApi.payloads.getMany('scene_31', 'view_53')
    const tr_types = await knackApi.calls.getMany(payload_1)

    console.log('tr_types', tr_types)

    // list transaction that are unprocessed

    const payload_2 = knackApi.payloads.getMany('scene_31', 'view_52')
    const unPro_trs = await knackApi.calls.getMany(payload_2)

    console.log('unPro_trs', unPro_trs)

    // list new transaction types

    const new_tr_types = listUniqueTrTypes(unPro_trs)
    console.log('new_tr_types', new_tr_types)

    if (new_tr_types.length > 0) {

        const payload_3 =  knackApi.payloads.postMany('scene_31', 'view_54', new_tr_types )
        const added_tr_types =  await knackApi.calls.postMany(payload_3)

    }

});



function listUniqueTrTypes(records) {

    const uniqueTrTypes = records.reduce((acc, rec) => {
        // rec.field_176_raw (type) rec.field_229_raw[0].identifier (bank Name)
        const type = rec.field_176_raw; // transaction type
        const bank = rec.field_229_raw[0]?.id; // bank name (ensure it's available)
        // Check if this type has already been added
        if (!acc.some(item => item.field_231 + item.field_232 === type + bank)) {
            acc.push({ field_231: type, field_232: rec.field_229_raw[0]?.id}); // Add type and bankName to the accumulator
        }
        return acc; // Return the updated accumulator
    }, [])

    return uniqueTrTypes
}



