// CREATE :

function createDetail() {
    return $(`
            <section class="columns">
                <div class="kn-details-column first column is-horizontal " style="flex-basis: undefined%"></div>
            </section>
    `)
}

function createDetailRow(col) {
    return $(`<div class="kn-details-group column-${col} columns"></div>`)
}

function createDetailColumn(label, position) {
    return $(`
            <div class="kn-details-group-column column" data-fas-ui="$col">
                <div class="kn-label-${label} kn-table is-unbordered colnum-${position}"></div>
            </div>
            `)
}

function createDetailElement(fieldKey, label = 'left') {
    const labelClass = label === 'left' ? 'kn-detail' : `kn-label-${label}`
    return $(`<div class="${labelClass} ${fieldKey}" data-fas-ui="$el"></div>`)
}

function createDetailFieldLabel(labelPosition, fieldKey) {

    return $(`<div class="kn-detail-label"></div>`)

    return $(`
            <div class="kn-label-${labelPosition} ${fieldKey}">
                <div class="kn-detail-label"></div>
            </div>
            `)
}

function createDetailFieldDetail(fieldKey) {

    return $(`<div class="kn-detail-body"></div>`)

    return $(`
        <div class="${fieldKey}">
            <div class="kn-detail-body"></div>
        </div>
            `)
}


function createDetailFieldLink(fieldKey) {

    return $(`<div class="kn-details-link" style="display:flex; justify-content:center;"></div>`)

    return $(`
        <div class="${fieldKey}">
            <div class="kn-details-link" style="display:flex; justify-content:center;"></div>
        </div>
            `)
}

// GET

function getDetail($view) {
    return $view.find("section.columns")
}

// APPEND

function appendDetailRow($det, $row) {
    $det.find('.kn-details-column').append($row)
}

function appendDetailCol($row, $col) {
    $row.append($col)
}

function appendDetailEl($col, $el) {
    $col.find('.kn-table.is-unbordered').append($el)
}

function appendDetailField($el, $fld) {
    $el.append($fld)
}

// POPULATE

function appendToLabel($label, $html) {
    $label.append($html)
    // $label.find('.kn-detail-label').append($html)
}

function appendToField($field, $html) {
    $field.append($html)
    // $field.find('.kn-detail-body').append($html)
}

function appendToLink($link, $html) {
    $link.append($html)
    // $link.find('.kn-details-link').append($html)
}

// EXPORT 

export const detail = {
    create: {
        detail: createDetail,
        row: createDetailRow,
        col: createDetailColumn,
        el: createDetailElement,
        label: createDetailFieldLabel,
        field: createDetailFieldDetail,
        link: createDetailFieldLink,
    },
    populate: {
        label: appendToLabel,
        field: appendToField,
        link: appendToLink
    },
    append: {
        rowToDet: appendDetailRow,
        colToRow: appendDetailCol,
        elToCol: appendDetailEl,
        fldToEl: appendDetailField
    },
    get: {
        detail: getDetail
    }

}
