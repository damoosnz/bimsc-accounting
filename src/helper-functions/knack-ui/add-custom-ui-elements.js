

function buildFilterMenu (buttons, onChange) {
    // Create the base menu container with Bulma CSS classes
    // 'tabs is-toggle is-flush' creates a toggle-style tab interface
    const $menu = $(`
        <div class="js-filter-menu tabs is-toggle is-flush fas-custom-filter-menu">
            <ul></ul>
        </div>
    `);
  
    // Get reference to the unordered list element
    const $ul = $menu.find('ul');
  
    // Iterate through the buttons array to create individual filter buttons
    buttons.forEach((btn, index) => {
        // Set the first button (index 0) as active by default
        const isActive = index === 0 ? 'is-active' : '';
  
        // Create and append list item for each button
        // data-value attribute stores the button's value for later retrieval
        $ul.append(`
            <li class="${isActive}" data-value="${btn.value}">
                <a><span>${btn.label}</span></a>
            </li>
        `);
    });
  
    // Store reference to all button elements
    const $btns = $menu.find('li');
  
    // Attach click event handler to all buttons
    $btns.on('click', function () {
        // Remove active state from all buttons
        $btns.removeClass('is-active');
        
        // Add active state to clicked button
        $(this).addClass('is-active');
        
        // Execute onChange callback if it's a valid function
        // Pass the clicked button's value as parameter
        if (typeof onChange === 'function') {
            onChange($(this).data('value'));
        }
    });
  
    return $menu;
  };

const customUi = {
    filters: (buttons, onChange) => buildFilterMenu (buttons, onChange)
}

export {customUi}

