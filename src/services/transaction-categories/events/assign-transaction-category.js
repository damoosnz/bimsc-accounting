import { hf } from "../../../helper-functions/helper-functions.js"
import { html_comp_knack } from "../../../html-components/local-library/fas-knack-html-components.js"
import { html_comp_custom } from "../../../html-components/local-library/fas-custom-html-components.js"
import { catMethods } from "../methods/transaction-categpries-api-methods.js"
import { runCategorisationRules } from "../functions/run-categorisation-rules.js"

$(document).on('knack-view-render.view_125', async function (event, view, data) {

    // CONSOLIDATE THE DATA
    // TRANSACTIONS
    const trs = data.filter(t => t.field_288_raw.length === 0)
    // CATEGORIES
    const cats = await catMethods.categories.get()
    console.log({ cats })
    // HINTS
    const hints = catMethods.hints.getFromCats(cats)
    console.log('hints', hints)

    // RUN THE CATEGORISATION RULES
    const isUpdate = await runCategorisationRules(trs, cats)
    if (isUpdate) {
        hf.knUI.manipViews.renderTabOrCal(view.key)
        return
    }

    // UI WIDGETS
    const $view = $(`#${view.key}`)

    // SAVE HINTS TO CATEGORY WIDGET
    function setSearchWidget() {

        // check if the url for search parm for view 125
        const search = hf.knUI.getFromUrl.search(view)
        console.log('search', search)
        if (!search) return

        // GET THE UI ELEMENTS
        const $recordsNav = $view.find('.kn-records-nav')
        const $searchCont = $recordsNav.find('.table-keyword-search').css({ display: 'flex' })

        // verify the search is avable 
        const isNoClash = checkNewHintConflict(search, hints)
        if (isNoClash !== true) {
            console.log('clash result: ', isNoClash)
            const $notSavable = create$conflict(search, isNoClash)
                .appendTo($searchCont)
            return
        }

        const $select = create$Select(cats).appendTo($searchCont)
        const $saveBtn = html_comp_knack.button('Save Hint', []).appendTo($searchCont).hide()

        $select.on('change', function () {
            // retrieve the selected category
            const catVal = $select.val()
            const catSel = cats.find(c => c.id === catVal)
            // display the save Btn
            $saveBtn
                .show()
                .on('click', async function () {
                    // create the new hint
                    const hint = await catMethods.hints.add(search.trim())
                    // associate the new hont to the selected category
                    await catMethods.categories.addHint(catSel, hint)
                    // refresh the UI
                    hf.knUI.manipViews.renderTabOrCal(view.key)
                })
        })

    }
    setSearchWidget()


    // LINE TRANSACTION PROCESSING WIDGET

    function setLineTrWidget() {

        for (const t of trs) {

            const $tr = $view.find(`#${t.id}`)
            const $catTd = $tr.find(`.field_288`)
            const $typTd = $tr.find(`.field_247`)
            const $parTd = $tr.find(`.field_248`)
            const $hinTd = $tr.find(`.field_236`)
            const $proDiv = $('<div>').appendTo($catTd)

            // remove the empty td span
            $catTd.find('span').remove()
            // create the drop list
            const $select = create$Select(cats).appendTo($proDiv)
            // create the assign to transaction
            const $trCont = $('<div>').appendTo($catTd)
            const $trBtn = html_comp_knack.smallButton('Transaction', []).appendTo($trCont).hide()

            // create the assign to type
            const $typCont = $('<div>').appendTo($typTd)
            const $typBtn = html_comp_knack.smallButton('Type', []).appendTo($typCont).hide()

            // create the assign to parties
            const $parCont = $('<div>').appendTo($parTd)
            const $parBtn = html_comp_knack.smallButton('Party', []).appendTo($parCont).hide()

            // create the assign to details
            const $hinCont = $('<div>').appendTo($hinTd)
            const $hinBtn = html_comp_knack.smallButton('Hints', []).appendTo($hinCont).hide()


            $select.on('change', function () {
                // retrieve the selected category
                t.catVal = $select.val()
                t.catSel = cats.find(c => c.id === t.catVal)
                console.log('New value selected:', t);
                // control visibility of btns
                if (!t.catSel) return
                // check the type is not used in cat rules
                // field_294

                // check the party is not used in cat rules
                // field_296
                const [partyId, partyName] = readKnackConn(t.field_248_raw)
                const catParties = t.catSel.field_296_raw
                const isPartyUsed = cats.some(c => c.field_296_raw.some(p => p.id === partyId))
                if (!isPartyUsed) {
                    $parBtn
                        .show()
                        .on('click', async function () {
                            // scene_68 view_137 update transaction category party
                            const recId = t.catSel.id
                            const recData = { field_296: [...catParties.map(p => p.id), partyId] }
                            console.log('parties record', recId, recData)
                            // UPDATE RECORD
                            await catMethods.categories.updateParties(recId, recData)
                            // REFRESH UI
                            hf.knUI.manipViews.renderTabOrCal('view_127')
                            hf.knUI.manipViews.renderTabOrCal(view.key)
                        })
                } else {
                    console.log('This party is already associated', partyName)
                }

                // assign to transaction
                $trBtn
                    .show()
                    .on('click', async function () {
                        const recs = [{ id: t.id, field_288: t.catSel.id }]
                        // UPDATE RECORD
                        await catMethods.transactions.updateCategory(recs)
                        // REFRESH UI
                        hf.knUI.manipViews.renderTabOrCal(view.key)
                    })

            });


        }

    }
    setLineTrWidget()




})

function create$conflict(search, test) {
    // tag kn-tag-filter kn-filter-field_288
    const $notSavable = $('<div>').css({ display: 'flex' }).addClass('input')
    const $searchSticker = $('<div>').addClass('tag').text(search).appendTo($notSavable)
    const $textDiv = $('<div>').text('is conflicting with').appendTo($notSavable)
    for (const t of test) {
        const $conflictSticker = $('<div>').addClass('tag').text(`${t.identifier} - (${t.catCode})`).appendTo($notSavable)
    }
    return $notSavable
}

function create$Select(cats) {
    // 1. Create the main <select> element using jQuery
    const $select = $('<select>', { id: 'category-dropdown', name: 'category', class: 'kn-select input' });

    // 2. Create and append a default/placeholder option
    const $defaultOption = $('<option>', {
        value: '',
        text: 'Select a Category',
        disabled: true,
        selected: true
    }).appendTo($select);

    // 3. Iterate over the categories array and create an option for each
    cats.forEach(c => {
        const $catOption = $('<option>', {
            value: c.id, // Use lowercase for the internal value
            text: c.field_244_raw               // Use the original text for display
        }).appendTo($select);           // Append the option to the select element
    });

    // Return the jQuery select object
    return $select;
}

function readKnackConn(value) {
    return [value[0].id, value[0].identifier]
}

function normTest(string) {
    return string.toLowerCase().replace(/\s/g, '').replace(/'/g, '')
}

function checkNewHintConflict(hint, hints) {

    // TEMP VERIFY HINTS SANITY
    const normedHint = normTest(hint)
    // test the normed hints is not clashing with any other hints
    const test = hints.filter(h => {
        const testKey = normTest(h.identifier)
        return testKey.includes(normedHint) || normedHint.includes(testKey)
    })
    if (test.length === 0) {
        return true
    }
    return test
}