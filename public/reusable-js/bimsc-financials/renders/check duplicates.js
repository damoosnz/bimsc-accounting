import { knackApi } from "bimsc-knack-api";
import { knackInterface } from "bimsc-knack-interface";

// scene_26 view_45

$(document).on('knack-view-render.view_45', async function (event, view, data) {

    knackInterface.msg.popup.add(view.key, 'loading in progress', 'spinner')//
    const payload = knackApi.payloads.getMany('scene_26', 'view_45')
    const records = await knackApi.calls.getMany(payload)
    console.log(records)

});