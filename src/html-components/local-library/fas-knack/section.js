export function createSectionBar(sections, clickToFirst = true) {

    const $view = $(`
        <div class="kn-menu kn-view fas-knack-ui-section-menu">
            <div class="menu-links" style="display: flex; align-items: center; justify-content: center">
                <nav class="menu-links__nav">
                    <ul class="menu-links__list">         
                    </ul>
                </nav>
            </div>
        </div>
    `);

    for (const s of sections) {

        const $s = $(`<li class="menu-links__list-item"></li>`)
        const $b = $(`<div id="${s.label}" class="knMenuLink knMenuLink--button knMenuLink--filled knMenuLink--size-medium knMenuLink--rounded"></div>`)
        $s.append($b)

        const $sLabel = $('<div>').text(s.label)
        $b.append($sLabel)

        if (s.icon) { $b.prepend($s.icon) }

        // Add click event handler
        if (typeof s.event === 'function') {
            $b.on('click', function () {
                $view.find('.knMenuLink').removeClass('bimsc-is-active');
                $(this).addClass('bimsc-is-active');
                s.event()
            });
        }

        // Append the $tab (li) to the <ul class="menu-links__list"> in $view
        $($view).find('ul').append($s);

    }

    // Click the first section button if requested

    if (clickToFirst) {
        setTimeout(() => {
            $view.find('.knMenuLink').first().trigger('click');
        }, 100);
    }

    return $view

}