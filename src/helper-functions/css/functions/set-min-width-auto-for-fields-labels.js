export function setMinWidthAutoforFieldLabels(view){

    const $view = $(`#${view.key}`)

    // $view.find('.kn-detail-label').removeAttr('style');
    $view.find('.kn-detail-label').addClass('bimsc-min-width-auto');

}