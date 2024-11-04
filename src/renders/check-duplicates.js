// import { knackInterface } from 'https://damoosnz.github.io/bimsc-knack-interface/dist/bundle.js'
import { knackInterface } from 'bimsc-knack-interface';
// import { knackApi } from 'https://cdn.jsdelivr.net/gh/damoosnz/bimsc-knack-api@latest/dist/bundle.js';
import { knackApi } from 'bimsc-knack-api';

// scene_26 view_45

let view_45RenderCount = -1

$(document).on('knack-view-render.view_45', async function (event, view, data) {

    view_45RenderCount += 1
    if (view_45RenderCount % 2 === 0) {

        // addCheckboxes : (view) => addCheckboxes(view),
        // addHeadEventHandler: (view, rules) => handleHeaderCheckboxChange(view, rules),
        // getChechedRecords: (view) => getTableCheckedRecords(view)

        knackInterface.msg.popup.add(view.key, 'loading in progress', 'spinner')

        const payload = knackApi.payloads.getMany('scene_26', 'view_45')
        const records = await knackApi.calls.getMany(payload)
        console.log('records', records)
        const dupRecords = checkForDuplicates(records)
        console.log('dupRecords', dupRecords)
        // filter view to only show duplicates records
        const filters = knackApi.filters.create('OR')
        for (var dup of dupRecords) {
            const rule = { field: 'field_177', operator: 'is', value: dup.field_177_raw }
            filters.rules.push(rule)
        }
        console.log('filters', filters)
        knackInterface.views.tables.setFilters(view, filters)
        knackInterface.msg.popup.remove(view.key)

    }

    knackInterface.views.tables.addCheckboxes(view)
    knackInterface.views.tables.addHeadEventHandler(view)
    $('#view_45_filters').remove()



});

function checkForDuplicates(records) {

    // Step 1: Count occurrences of each field_177_raw value
    const fieldCounts = records.reduce((acc, rec) => {
        const fieldValue = rec.field_177_raw;
        acc[fieldValue] = (acc[fieldValue] || 0) + 1; // Increment the count for each value
        return acc;
    }, {});

    // Step 2: Filter records where field_177_raw occurs at least twice
    const duplicateRecords = records.filter(rec => fieldCounts[rec.field_177_raw] >= 2);

    return duplicateRecords


}