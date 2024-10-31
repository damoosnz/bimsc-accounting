import { knackInterface } from 'https://cdn.jsdelivr.net/gh/damoosnz/bimsc-knack-interface@main/dist/bimsc-knack-interface.bundle-v1.js'
import { knackApi } from 'https://cdn.jsdelivr.net/gh/damoosnz/bimsc-knack-api@main/dist/bundle-v1.js';

// scene_26 view_45

$(document).on('knack-view-render.view_45', async function (event, view, data) {

    knackInterface.msg.popup.add(view.key, 'loading in progress', 'spinner')//
    const payload = knackApi.payloads.getMany('scene_26', 'view_45')
    const records = await knackApi.calls.getMany(payload)
    console.log(records)

});