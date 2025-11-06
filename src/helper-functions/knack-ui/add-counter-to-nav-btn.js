import { html_comp_custom } from "../../html-components/local-library/fas-custom-html-components.js"

export function addCounterToNavBtn(btnid, counter) {

    const $navMenu = $('.fas-knack-ui-nav-menu')
    const $btn = $navMenu.find(`#${btnid} a`)

    // check if existing and remove if yes

    const $extgPill = $btn.find('.fas-pill')
    if ($extgPill.length > 0) {
        $extgPill.remove()
    }

    if ($btn.length > 0 && counter > 0) {
        const $pill = html_comp_custom.pills(counter)
        $btn.append($pill)

    }

}