export function createTag(text, link, newTab = false) {
    
    // Conditionally set the target attribute
    const targetAttribute = newTab ? 'target="_blank" rel="noopener noreferrer"' : '';

    // Construct the <a> tag, including the target attribute
    const $tag = $(`<a href="${link}" ${targetAttribute} class="knViewLink kn-link kn-link-page knViewLink--page knViewLink--filled knViewLink--size-small knViewLink--rounded fas-knack-ui-tag">${text}</a>`);

    return $tag; // Return the jQuery object
}