import {card }from './fas-knack/card.js'
import { createButton, createLinkButton, createSmallButton } from "./fas-knack/button.js";
import { createFilterMenuV1 } from "./fas-knack/filters.js";
import { createTag } from "./fas-knack/tag.js";
import { createNavBar, addNavTab } from "./fas-knack/nav-menu.js";
import { createSectionBar } from "./fas-knack/section.js";
import { detail } from './fas-knack/detail.js';


export const html_comp_knack = {
    button: (text, events) => createButton(text, events),
    linkButton: ($html, events) => createLinkButton($html, events),
    smallButton: createSmallButton,
    filterMenuV1: (menuRef, menuLabel, buttons) => createFilterMenuV1(menuRef, menuLabel, buttons),
    navbar: {
        create: createNavBar,
        addNavBtn: addNavTab,
    },
    sectionBar: (sections, clickToFirst) => createSectionBar(sections, clickToFirst),
    tag: (text, link, newTab) => createTag(text, link, newTab),
    card,
    detail,
}