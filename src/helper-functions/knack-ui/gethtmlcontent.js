export function getHtmlContentTable(view) {

    const data = [];

    $("#" + view.key + " tbody tr").each(function () {
        const $cells = $(this).find('td');
        const entry = {
            col1: $cells.eq(0).text().trim(),
            col2: parseInt($cells.eq(1).text().trim(), 10),
            col3: parseInt($cells.eq(2).text().trim(), 10)
        };
        data.push(entry);
    });

    return data;

}