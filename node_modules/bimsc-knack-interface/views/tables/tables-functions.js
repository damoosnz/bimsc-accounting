// add tick boxes to table 

export function addCheckboxes(view) {
    // Add checkbox to the header to select/unselect all
    $('#' + view.key + ' .kn-table thead tr').prepend('<th><input type="checkbox"></th>');

    // Add checkbox to each row in the table body
    $('#' + view.key + ' .kn-table tbody tr').each(function () {
        if (!$(this).hasClass('kn-table-group')) {
            $(this).prepend('<td><input type="checkbox"></td>');
        } else {
            $(this).prepend('<td></td>'); // Append an empty <td>
        }
    });
}

// function to handle changes on theadcheckbox

export function handleHeaderCheckboxChange(view, selectionRules) {
    // handle default with no specifeid selction rules
    selectionRules = selectionRules || (() => true);
    // Add change event listener to the thead checkbox
    $('#' + view.key + ' .kn-table thead input[type="checkbox"]').change(function () {
        var isChecked = $(this).prop('checked');
        // Iterate over all checkboxes in tbody
        $('#' + view.key + ' .kn-table tbody tr:not(.kn-table-group) input[type="checkbox"]').each(function () {
            var selectBasedOnRules = selectionRules()
            // Set checkbox status based on the thead checkbox and autoselect
            $(this).prop('checked', isChecked && selectBasedOnRules);
        });
    });
}

export function getTableCheckedRecords(view) {

    const checkedRecords = []

    $('#' + view.key + ' .kn-table tbody tr:not(.kn-table-group) input[type="checkbox"]').each(function () {
        var isChecked = $(this).prop('checked');
        if (isChecked) {
            var id = $(this).closest('tr').attr('id');
            checkedRecords.push({ id: id })
        }
    });

    return checkedRecords

}

export function addFilterToTableView(view, newFilters) {
    const filters = Knack.views[view.key].getFilters();
    let combinedFilters;
    if (filters.match) {
        filters.rules.push(newFilters);
        combinedFilters = JSON.parse(JSON.stringify(filters));
    } else if (filters.length) {
        filters.push(newFilters);
        combinedFilters = {
            match: 'and',
            rules: JSON.parse(JSON.stringify(filters))
        }
    } else {
        combinedFilters = [newFilters];
    }
    Knack.views[view.key].handleChangeFilters(JSON.stringify(combinedFilters));
}

export function setFilterToTableView(view, newFilters) {
    Knack.views[view.key].handleChangeFilters(JSON.stringify(newFilters));
}

export function reRenderTableOrCalendar(view) {
    var originalFilters = JSON.stringify(Knack.views[view.key].getFilters());
    Knack.views[view.key].handleChangeFilters(originalFilters)
}