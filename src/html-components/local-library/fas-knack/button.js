export function createButton(text, events = []) {

    // Convert string to a jQuery object
    const $button = $(`<div class="kn-button fas-knack-ui-button"></div>`);

    if (text instanceof $) {
        $button.append(text);
    } else if (typeof text === 'string') {
        $button.text(text);
    } else if (text instanceof Node) {
        $button.append(text);
    }

    // Loop through and call each event function

    $button.on('click', function () {
        events.forEach(fn => {
            if (typeof fn === 'function') {
                fn($(this));
            }
        });
    })

    return $button; // Return the jQuery object
}

export function createLinkButton($html, events) {

    // Convert string to a jQuery object
    const $button = $(`<div class="knViewLink kn-link kn-link-page knViewLink--page knViewLink--filled knViewLink--size-small knViewLink--rounded fas-knack-ui-button">${$html}</div>`);

    // Loop through and call each event function

    $button.on('click', function () {
        events.forEach(fn => {
            if (typeof fn === 'function') {
                fn();
            }
        });
    })

    return $button; // Return the jQuery object

}

export function createSmallButton($html, events) {

    const $btn = $(`<button class="export-data kn-button is-button is-small"></button>`);
    $btn.append($html)

    $btn.on('click', function () {
        events.forEach(fn => {
            if (typeof fn === 'function') {
                fn();
            }
        });
    })

    return $btn

}