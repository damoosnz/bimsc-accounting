export function createDateFromKnackField(field) {

    const year = field.date.slice(-4)
    const month = field.date.substring(0, 2)
    const day = field.date.substring(3, 5)
    const hours = Math.floor(field.time / 60);
    const minutes = field.time % 60;

    return new Date(year, month - 1, day, hours, minutes)

}

export function setDateForKnackFilters(date, includeTime = true) {

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear())

    const dateStr = `${day}/${month}/${year}`

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    const timeStr = includeTime ? `${hours}:${minutes}` : ""

    return { date: dateStr, time: timeStr }

}

export function setDateForKnackAPI(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const am_pm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // convert 0 → 12, 13 → 1, etc.

    return {
        date: dateStr,
        hours: String(hours).padStart(2, "0"),
        minutes,
        am_pm,
    };
}

export const dates = {
    get: {
        fromKnackField: createDateFromKnackField
    },
    set: {
        toKnackFilters: setDateForKnackFilters,
        toKnackAPI: setDateForKnackAPI
    }

}