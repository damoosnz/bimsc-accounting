export function displayReadableJson(view, field) {

    $(`#${view.key} td[data-field-key=${field}]`).each(function () {
        // Find the JSON string within the <span> tag inside the <td>
        const jsonString = $(this).find('span').text();
        // const jsonData = JSON.parse(jsonString)
        const prettyJson = bimscJs.files.jsonToHtml(jsonString)
        $(this).html(prettyJson);
    });

}