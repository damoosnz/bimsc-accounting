export function removeTextDecorationInCalendarList(view) {

    const $view = $(`#${view.key}`)
    $view.find('.kn-cal-list-details').css('text-decoration', 'none');;

}