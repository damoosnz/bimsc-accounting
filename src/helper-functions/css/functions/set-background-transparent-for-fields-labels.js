

export function setBackgroundTransparentForFieldLabels(view) {

    const $view = $(`#${view.key}`)
    $view.find('.kn-detail-label , .kn-detail-label span').addClass('bimsc-background-transparent');

}