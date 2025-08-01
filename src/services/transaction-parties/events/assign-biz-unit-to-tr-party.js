import { hf } from "../../../helper-functions/helper-functions.js";

$(document).on('knack-view-render.view_108', function (event, view, data) {

    // get the buttons to remove the href and replace with a click event

    const $view = $(`#${view.key}`)

    for (const rec of data) {

        const $rec = $view.find(`#${rec.id}`)
        const $tag = $rec.find('a')
        $tag.removeAttr('href')

        const event = async () => {

            // get the records on page

            const trParties = await hf.knUI.getFromPage.records('view_103')
            const recs = trParties.map(tp => {
                return {
                    id: tp.id,
                    field_242: rec.id
                }
            })
            const pl = hf.knAPI.PL.putMany('scene_52', 'view_103', recs)
            const res = await hf.knAPI.calls.putMany(pl)

            hf.knUI.manipViews.renderTabOrCal('view_103')
        }

        $tag.on('click', event)


    }



});