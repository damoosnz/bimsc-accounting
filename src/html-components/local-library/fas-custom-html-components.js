import { fasEvSty } from "../../helper-functions/css/functions/fas-events-styles.js";

function createSticker(type, label) {
    const $sticker = $(`<span class="bimsc-sticker ${type}">${label}</span>`)
    return $sticker
}

export function createPill(counter) {
    return $(`<div class="fas-pill" style="margin-right: 4px; margin-left: 4px;">${counter}</div>`)
}

function createStatusIcon(type) {

    const iconMap = {
        go: 'fas fa-check-circle',
        stop: 'fas fa-hand',
        caution: 'fas fa-triangle-exclamation',
        waiting: 'fas fa-hourglass-half',
        proceed: 'fas fa-hand-o-right',
        add: 'fas fa-plus',
        expand: 'fas fa-plus-square-o',
        collapse: 'fas fa-minus-square-o',
        download: 'fas fa-download',
        expandChevron: 'fas fa-chevron-down',
        collapseChevron: 'fas fa-chevron-up',
        todo: 'fas fa-bolt',
        fill: 'fas fa-fill',
        empty: 'fas fa-eraser',
        remove: 'fas fa-times-circle',
        cart: 'fas fa-shopping-cart', 
        save: 'fas fa-bookmark',
        clone: 'fas fa-clone'
    }
    const icon = iconMap[type] || iconMap.proceed

    return $(`<i class="${icon}" style="margin-right: 4px; margin-left: 4px;"></i>`);
}

function createOverlayCont() {
    return $('<div>').addClass('overlay')
}

function createOverlayInnerCont() {
    return $('<div>').addClass('overlay-inner-container')
}

function createOverlayTitle() {
    return $('<div>').addClass('overlay-title')
}

function createOverlayContent() {
    return $('<div>').addClass('overlay-content')
}

function createTableGroupRow($view, groupRec) {

    return $(
        `<tr id="${groupRec.id}" class="bimsc-table-group bimsc-group-level-${groupRec.level}">
            <td style="padding-top:4px; padding-bottom:0px" colspan="${$view.find('thead th').length}">
                <div class="table-group-header">
                    <div class="table-group-label">
                        <span>${groupRec.label}</span>
                    </div>
                    <div class="table-group-count">
                        <span>${groupRec.records.length}</span>
                    </div>
                </div>
            </td>
        </tr>`
    )

}

function createTableGroupHeader(groupRow) {

    return $(`
        <div class="table-group-header">
            <div class="table-group-label">
                <span>${groupRow.label}</span>
            </div>
            <div class="table-group-count">
                <span>${groupRow.records.length}</span>
            </div>
        </div>
        `)
}

function createTableTotalTd() {

    return $(`
        <td style="padding-top:4px; padding-bottom:0px">
            <div class="table-totals-header"></div>
        </td>
            `)

}

function createTableTotalRow($view, groupRec) {

    const $ths = $view.find('th')
    const numCols = $ths.length

    const $tr = $(`<tr id="${groupRec.id}" class="bimsc-table-totals bimsc-totals-level-${groupRec.level}"></tr>`)

    for (var i = 0; i < numCols; i++) {
        const $td = createTableTotalTd()
        $tr.append($td)
    }



    for (const f of groupRec.total.results) {

        console.log(f.fKey, f.val)
        const val = f.val
        const $th = $view.find(`th.${f.fKey}`).first()
        const index = $th.index()
        const $calc = $(`<span>${groupRec.total.label}${val}</span>`)
        $tr.find('td').eq(index).find('.table-totals-header').append($calc)
    }



    // if (minIndex > 0) {
    //     $tr.find('td').eq(0).append($(`<div class="table-totals-header">${groupRec.total.calc}</div>`));
    // }

    return $tr

}


export const html_comp_custom = {
    stickers: (type, label) => createSticker(type, label),
    icons: (type) => createStatusIcon(type),
    pills: createPill,
    overlay: {
        cont: createOverlayCont,
        innerCont: createOverlayInnerCont,
        title: createOverlayTitle,
        content: createOverlayContent,
    },
    groupRow: createTableGroupRow,
    totalsRow: createTableTotalRow,
    groupHeader: createTableGroupHeader
}