// rename filters fields label to match column header

export function renameFilterOptionsWithFieldLabels(view_type) {

$(document).on('change', '#kn-filters-form', function () {
    // match filter input options to displayed column header
    var columnHeaders = [];
    view.columns.forEach(function (columnHeader) {
        var filterInputLabel = { "field": columnHeader.field.key, "label": columnHeader.header };
        columnHeaders.push(filterInputLabel);
    });

    var i = 0;
    $('#kn-filters-form select.field option').each(function () {
        $('#kn-filters-form select.field').find('option[value="' + columnHeaders[i].field + '"]').text(columnHeaders[i].label);
        i++;
    });
});

}

