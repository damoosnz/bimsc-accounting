import { fas_HtmlTemplates } from "./html-components.js";
import { fas_button_classes } from "./html-components.js";

// Function to replace placeholders and create the button
export function create_fas_Button(id, buttonClass, text) {
    // Replace placeholders with actual values
    let buttonHtml = fas_HtmlTemplates.fas_button
        .replace('{id}', id || '') // Replace id placeholder
        .replace('{buttonClass}', fas_button_classes[buttonClass]) // Replace buttonClass placeholder
        .replace('{text}', text); // Replace text placeholder
    
    // Create jQuery object from the HTML string
    return $(buttonHtml);
}

export function create_fas_Menu(id,icon,link,text) {
    let menuHtml = fas_HtmlTemplates.fas_menu
    return     // Create jQuery object from the HTML string
    return $(menuHtmlHtml);

}