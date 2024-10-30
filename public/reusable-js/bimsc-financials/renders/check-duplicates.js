import { knackInterface } from 'https://cdn.jsdelivr.net/gh/damoosnz/bimsc-knack-interface@main/dist/bimsc-knack-interface.bundle.js'
// import { bwKnackApi } from '../../to-bundle-for-nodejs/to-bundle.js';

// scene_26 view_45

$(document).on('knack-view-render.view_45', async function (event, view, data) {

    knackInterface.msg.popup.add(view.key, 'loading in progress', 'spinner')//
    const payload = bwKnackApi.payloads.getMany('scene_26', 'view_45')
    const records = await bwKnackApi.calls.getMany(payload)
    console.log(records)

});