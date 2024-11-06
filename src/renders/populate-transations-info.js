
// scene_30/views/view_50
// scene_19 view_38

import { knackApi } from "bimsc-knack-api";

$(document).on('knack-view-render.view_38', async function (event, view, data) {

    //get unrprocessed transactions
    const payload_1 = knackApi.payloads.getMany('scene_30', 'view_50')
    const unPro_trs = await knackApi.calls.getMany(payload_1)
    // console.log('unPro_trs', unPro_trs)

    // get transaction types
    const payload_2 = knackApi.payloads.getMany('scene_31', 'view_53')
    const tr_types = await knackApi.calls.getMany(payload_2)
    // console.log('tr_types', tr_types)

    // populate party and details field

    const pro_trs = []

    if (unPro_trs.length > 0) {
        for (const tr of unPro_trs) { //.slice(0,5)
            const tr_type = tr_types.find(typ => 
                tr.field_229_raw[0].identifier === typ.field_232_raw[0].identifier && 
                tr.field_176_raw === typ.field_231_raw
            );   
            console.log('tr_type',tr_type)         
        
            if (tr_type) { // Ensure that tr_type exists
                const tr_config = JSON.parse(tr_type.field_233_raw);
                // console.log('tr_config',tr_config)
                const pro_tr = processData(JSON.parse(tr.field_228), tr_config);
                // console.log('pro_tr', pro_tr);
                pro_tr.id = tr.id
                pro_trs.push(pro_tr)
            } else {
                console.warn('Transaction type not found for:', tr);
            }
        }
    }

    const pck_pro_trs = packageProTrs(pro_trs)
    console.log('pck_pro_trs',pck_pro_trs)

    const payload_3 = knackApi.payloads.putMany('scene_30', 'view_57', pck_pro_trs)
    const upd_pro_trs = await knackApi.calls.putMany(payload_3)

    console.log(upd_pro_trs)

});

// Helper function to safely access nested properties
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Unified processData function
function processData(jsonData, config) {
    // console.log('jsonData',jsonData)
    // console.log('config',config)
    const party =  config.party.map(field => getNestedValue(jsonData, field)).filter(Boolean).join(' to ')
    const details = config.details.map(field => getNestedValue(jsonData, field)).filter(Boolean).join(' ')
    return {
        party: party,
        details: details
    };
}

function packageProTrs(pro_trs) {

    return pro_trs.map( tr => {
        return {
            id: tr.id,
            field_235: tr.party,
            field_236: tr.details
        }
    })

}
