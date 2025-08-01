


$(document).on('knack-view-render.view_73', async function (event, view, records) {

    const recs = []

    for (var i = 0; i < 5000; i++) {
        const rec = { id: '6732678344678a02b6de91f0', field_253: "test dev" }
        recs.push(rec)
    }

    const payload = knackApi.payloads.putMany('scene_40', 'view_73', recs)
    const res = await knackApi.calls.putMany(payload)
    console.log('res', res)

    const result = mergeNArrays(res)
    console.log('result', result)


});

