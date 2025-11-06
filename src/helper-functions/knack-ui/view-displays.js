import { hf } from "../helper-functions.js";
import { html_comp_custom } from "../../html-components/local-library/fas-custom-html-components.js";

async function collapseEvent(view) {

    const $view = $(`#${view.key}`)
    const $viewTitle = $view.find('.view-header h2')
    if ($viewTitle.length === 0) return

    const $expand = html_comp_custom.icons('expandChevron').attr('collapse', 'false');
    const $collapse = html_comp_custom.icons('collapseChevron').attr('collapse', 'true');

    const $icon = await hf.knUI.getFromPage.element(`#${view.key} [collapse]`);
    const shouldCollapse = $icon.attr('collapse') === 'true';

    // Hide/show content
    $view.children().each(function () {
        const $child = $(this);
        if (!$child.hasClass('view-header')) {
            shouldCollapse ? $child.hide() : $child.show();
        }
    });

    // Swap icon
    $icon.remove();
    $viewTitle.prepend(shouldCollapse ? $expand : $collapse);

    window.scrollTo(window.scrollX, window.scrollY + 1);
    window.scrollTo(window.scrollX, window.scrollY - 1);

}

export const diplayViews = {
    collapse: collapseEvent
}

