export function createNavBar() {

    const level = 1

    const $view = $(`
        <div class="kn-menu kn-view fas-knack-ui-nav-menu">
            <div class="menu-links">   
                <nav class="menu-links__nav">
                    <ul class="menu-links__list" style="display: flex; align-items: center;"></ul>
                </nav>
            </div>
        </div>
    `);

    const $arrow = $(`
        <li class="menu-links__list-item" style="margin-right:5px;">
            <div class="knMenuLink knMenuLink--button knMenuLink--filled knMenuLink--size-medium knMenuLink--rounded">
                <i class="fas fa-arrow-right" style="margin-right:4px;"></i>
                <div class="fas-menu-label">...</div>
            </div>
        </li>         
        `)

    $view.find('ul').append($arrow)

    // <div class="menu-arrow" style="width: 15px; text-align: center; margin-right: 10px;">└►</div>



    return $view

}

export function addNavTab(tab) {

    const $navBtn = $(`
            <li id="${tab.id}" class="menu-links__list-item">
                <a href="${tab.url}" data-kn-id="b03a3c3a-73d7-4bd3-8ef5-bb2dcee48886" class="knMenuLink knMenuLink--button knMenuLink--filled knMenuLink--size-medium knMenuLink--rounded" data-menu-link-count="1" data-vue-component="menuLink">
                    <div class="fas-nav"></div>                
                </a>
            </li> 
        `)

    if (!tab.icon) tab.icon = 'fa-file-alt'
    const $icon = $('<i>').addClass(`fa ${tab.icon}`).css('margin-right', '4px')
    $navBtn.find('.fas-nav').append($icon)

    if (tab.active) {
        $navBtn.find('a').addClass('bimsc-is-active knMenuLink--isActive')
    }

    $navBtn.find('.fas-nav').append($(`<div class="fas-menu-label">${tab.name}</div>`))

    return $navBtn

}