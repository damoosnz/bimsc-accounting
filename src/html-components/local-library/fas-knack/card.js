// *****CREATE
//  CARD
function createCard(rec_id) {
    return $(`
    <div class="kn-list-item-container kn-list-container column is-full" id="${rec_id}" data-record-id="${rec_id}" style="width:98%;">
        <section class="columns">
            <div class="kn-details-column first column is-horizontal " style="flex-basis: 100%"></div>
        </section>
    </div>
    `)
}
//  ROW
function createCardRow(col) {
    return $(`<div class="kn-details-group column-${col} columns"></div>`)
}
// COLUMN
function createCardColumn(label, position) {
    return $(`
            <div class="kn-details-group-column column">
                <div class="kn-label-${label} kn-table is-unbordered colnum-${position}"></div>
            </div>
            `)
}
//  LABEL
function createCardFieldLabel(labelPosition, fieldKey) {
    return $(`
            <div class="kn-label-${labelPosition} ${fieldKey}">
                <div class="kn-detail-label"></div>
            </div>
            `)
}
//  DETAIL
function createCardFieldDetail(fieldKey) {
    return $(`
        <div class="${fieldKey}">
            <div class="kn-detail-body"></div>
        </div>
            `)
}
//  LINK
function createCardFieldLink(fieldKey) {
    return $(`
        <div class="${fieldKey}">
            <div class="kn-details-link" style="display:flex; justify-content:center"></div>
        </div>
            `)
}

// *****APPEND
//  ROW
function appendCardRow($card, $row) {
    $card.find('.kn-details-column').append($row)
}
//  COLUMN
function appendCardCol($row, $col) {
    $row.append($col)
}
//  FIELD
function appendCardField($col, $field) {
    $col.find('.kn-table.is-unbordered').append($field)
}

// *****POULATE
//  LABEL
function appendToLabel($label, $html) {
    $label.find('.kn-detail-label').append($html)
}
//  FIELD
function appendToField($field, $html) {
    $field.find('.kn-detail-body').append($html)
}
//  LINK
function appendToLink($link, $html) {
    $link.find('.kn-details-link').append($html)
}

// HIDE
function hideField(view, fieldKeys) {
    const $view = $(`#${view.key}`)
    for (var f of fieldKeys) {
        const $fld = $view.find(`.${f}`)
        if (!$fld.length) {
            console.warn(`No DOM element found for jobOffer ID: ${f.id}`);
            continue;
        }
        $fld.hide()
    }
}

//  DEPRECATED
function createCardFieldError(err) {

    return $(`<div class="kn-message is-error ${err}" style="padding-top: 5px; padding-bottom:5px;">
                <span class="kn-message-body">
                </span>
            </div>`)
}
function createCardFieldComment() { }

function appendToErr($err, $html) {
    $err.find('.kn-message-body').append($html)
}
function appendToError() {

}
function appendToComment() {

}
export function addCardDetail($card, row, col, labelPos, field = 'field', $label, $detail) {

    const $item = $(`
        <div class="kn-label-${labelPos} ${field}">
            <div class="kn-detail-label">
            </div>
        <div class="${field}">
            <div class="kn-detail-body">
            </div>
        </div>
        `)

    if ($label.length > 0) {
        $item.find('.kn-detail-label').append($label)
    } else {
        $item.find('.kn-detail-label').remove()
    }

    $item.find('.kn-detail-body').append($detail)

    const $row = $card.find(`.rownum-${row}`)
    $row.find(`.colnum-${col}`).append($item)

    return $card

}

export const card = {
    create: {
        card: createCard,
        row: createCardRow,
        col: createCardColumn,
        label: createCardFieldLabel,
        detail: createCardFieldDetail,
        link: createCardFieldLink,
        error: createCardFieldError,
        comment: createCardFieldComment
    },
    append: {
        rowToCard: appendCardRow,
        colToRow: appendCardCol,
        fieldToCol: appendCardField,
    },
    populate: {
        label: appendToLabel,
        detail: appendToField,
        link: appendToLink,
        error: appendToError,
        comment: appendToComment,
        error: appendToErr
    },
    hide: {
        field: hideField
    }
}

