import { hf } from "../../../helper-functions/helper-functions.js";

$(document).on('knack-view-render.view_108', async function (event, view, data) {

    $(`#${view.key}`).hide()

});

$(document).on('knack-view-render.view_103', function (event, view, data) {

    // add hyperlink to google search

    const $view = $(`#${view.key}`)
    const $tbody = $view.find('tbody')
    const $trs = $tbody.find('tr')

    $trs.each(function () {
        const $tr = $(this)
        const $td = $tr.find('.field_239')
        const $span = $td.find('span'); // adjust if your span has a class

        const text = $span.text().trim();
        if (text && !$td.find('a').length) {
            const url = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
            $span.wrap(`<a href="${url}" target="_blank" rel="noopener noreferrer"></a>`);
        }
    })


})

$(document).on('knack-view-render.view_103', async function (event, view, data) {

    const $view = $(`#${view.key}`)
    const $thead = $view.find(`thead`)
    const $ths = $thead.find('th')

    // get the buisness unit records from view 108

    const records = await hf.knUI.getFromPage.records('view_108')
    const $recView = await hf.knUI.getFromPage.element('#view_108')

    for (const rec of records) {

        console.log(rec)

        const $rec = $recView.find(`#${rec.id}`)
        const $tag = $rec.find('a').clone()
        $tag.removeAttr('href')
        $tag.text(rec.field_160_raw)
        console.log('tag cloned')

        const event = async () => {
            const recs = data.map(tp => ({ id: tp.id, field_242: rec.id }))
            const pl = hf.knAPI.PL.putMany('scene_52', 'view_103', recs)
            const res = await hf.knAPI.calls.putMany(pl)
            hf.knUI.manipViews.renderTabOrCal('view_103')
        }

        $tag.on('click', event)

        // move the tag to the action row in the table 

        const $recTh = $ths.filter(function () { return $(this).text().trim() === rec.field_160_raw; });
        $recTh.find('span').html($tag)

    }

})


