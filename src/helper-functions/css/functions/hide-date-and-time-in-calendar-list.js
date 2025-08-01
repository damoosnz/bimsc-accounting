export function hideDateAndTimeInCalendarList(view) {

    const $view = $(`#${view.key}`)
    $view.find('.kn-cal-list-day, .kn-cal-list-date, .kn-cal-list-time').hide();

}