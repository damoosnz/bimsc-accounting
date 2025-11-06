export function createFilterMenuV1(menuRef, menuLabel, buttons) {

    // Create the base menu container with Bulma CSS classes
    // 'tabs is-toggle is-flush' creates a toggle-style tab interface
    const $menu = create$FilterMenu(menuRef, menuLabel)

    // Get reference to the unordered list element
    const $ul = $menu.find('ul');

    // Iterate through the buttons array to create individual filter buttons
    buttons.forEach((btn, index) => {
        // Set the first button (index 0) as active by default
        const isActive = index === 0 ? 'is-active' : '';

        // Create and append list item for each button // class="${isActive}"
        const $li = $(`
            <li id= "${btn.id}">
                <a><span>${btn.label}</span></a>
            </li>
            `);

        // Define the click event directly in the loop
        $li.on('click', function () {

            // Remove active state from all buttons and Add active state to clicked button
            $ul.find('li').removeClass('is-active');
            $(this).addClass('is-active');

            // Loop through and call each event function
            btn.events.forEach(fn => {
                if (typeof fn === 'function') {
                    fn();
                }
            });

        });

        // Append the list item to the ul
        $ul.append($li);
    });

    // // Force-click the first button after they're all added
    // setTimeout(() => {
    //     $ul.find('li').first().trigger('click');
    // }, 0);

    return $menu;

}

function create$FilterMenu(ref, title) {

    return $(`
        <div class="bimsc-knack-ui-filter-menu ${ref.toLowerCase()}">
            <div><b>${title}</b></div>
            <div class="js-filter-menu tabs is-toggle is-flush">
                <ul></ul>
            </div>
        </div>
    `);

}

function create$FilterButton()  {


    
}