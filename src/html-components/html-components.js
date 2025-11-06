// const fasButtonTypes = {
//     action 
//     viewLink
//     formSubmit
//     menulink
//     menulink
//     filters
// }

const fas_HtmlTemplates = {
    fas_button: `
        <div>
            <button id="{id}" class="{buttonClass}">
                <span class="knViewLink__label">{text}</span>
            </button>
        </div>
    `,
    // Add more templates as needed
    fas_menu:   `
        <li class="menu-links__list-item">
            <a href="#" class="knMenuLink knMenuLink--button knMenuLink--filled knMenuLink--size-medium knMenuLink--rounded" id="button-1" data-menu-link-count="1">
                <span class="knMenuLink__icon knMenuLink__icon--isLeft"><i class="fa fa-user"></i>
                </span>Profile
            </a>
        </li>
        `,
    another_template: `
        <div class="{containerClass}">
            <p>{paragraphText}</p>
        </div>
    `
    // You can add more templates as needed
};
export { fas_HtmlTemplates };


const fas_button_classes = {
    viewLink: 'knViewLink kn-link kn-link-page knViewLink--page knViewLink--filled knViewLink--size-small knViewLink--rounded'
};
export { fas_button_classes };

