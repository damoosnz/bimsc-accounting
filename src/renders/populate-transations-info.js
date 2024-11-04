import { knackApi } from 'https://damoosnz.github.io/bimsc-knack-api/dist/bundle.js';

// scene_30/views/view_50

// scene_19 view_38

$(document).on('knack-view-render.view_38', async function (event, view, data) {

    //get unrprocessed transactions
    const payload_1 = knackApi.payloads.getMany('scene_30', 'view_50')
    const unPro_trs = await knackApi.calls.getMany(payload_1)
    console.log('unPro_trs',unPro_trs)

    // get transaction types
    const payload_2 = knackApi.payloads.getMany('scene_31', 'view_53')
    const tr_types = await knackApi.calls.getMany(payload_2)
    console.log('tr_types',tr_types)

    if (unPro_trs.length >0) {

        // for (var tr of unPro_trs) {
        //     var tr_type = tr_types.find( item => {
        //         item.field_231 + item.field_232 ===  + bank)



        //     })


        // }



    }


});