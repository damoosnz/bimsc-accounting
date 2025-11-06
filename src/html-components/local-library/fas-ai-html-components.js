
function createButton(text, event) {

    // Convert string to a jQuery object
    const $button = $(`<div class="bimsc-ai-button"><i class="fa fa-magic"></i> ${text}</div>`);

    // Attach click event if provided
    if (typeof event === "function") {
        $button.on("click", event);
    }

    return $button; // Return the jQuery object
}

function createContainer($content, event) {

    // Create a jQuery object
    let $container = $('<div class="bimsc-ai-container"><i class="fa fa-magic"></i></div>');

    // Append content if provided
    if ($content) {
        $container.append($content);
    }

    // Attach click event if provided
    if (typeof event === "function") {
        $container.on("click", event);
    }

    return $container; // Return the jQuery object
}

export const html_comp_ai = {
    button: (text, event) => createButton(text, event),
    container: ($content, event) => createContainer($content, event)
}