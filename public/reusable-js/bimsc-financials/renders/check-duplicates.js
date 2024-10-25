import { knackApi } from 'https://raw.githubusercontent.com/damoosnz/bimsc-knack-api/main/index.js';
import { knackInterface } from 'https://raw.githubusercontent.com/damoosnz/bimsc-knack-interface/main/index.js';



// scene_26 view_45

$(document).on('knack-view-render.view_45', async function (event, view, data) {

    knackInterface.msg.popup.add(view.key, 'loading in progress', 'spinner')//
    const payload = knackApi.payloads.getMany('scene_26', 'view_45')
    const records = await knackApi.calls.getMany(payload)
    console.log(records)

});