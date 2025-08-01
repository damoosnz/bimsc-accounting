import dateFormat from 'https://cdn.skypack.dev/dateformat';

export function convert_ddmmyyyy_to_yyyymmdd(dateString) {
    const [day, month, year] = dateString.split('/');
    const resDate = new Date(`${year}-${month}-${day}`); // Creates a Date object
    const resString = `${year}${month}${day}`
    const resNum = parseInt(resString)
    return { resDate, resString, resNum }
}

export function convert_yyyymmdd_to_ddmmyyyy(dateString) {
    console.log(dateString)
    const [day, month, year] = [dateString.slice(6, 8), dateString.slice(4, 6), dateString.slice(0, 4)]
    const resDate = new Date(`${year}-${month}-${day}`); // Creates a Date object
    const resString = `${day}/${month}/${year}`; // Formats the date as dd/mm/yyyy
    return { resDate, resString };

}

export function convert_dd_mm_yyyy_To_ISODate(dateString) {

    // Split the dd/mm/yyyy string
    const [day, month, year] = dateString.split('/');

    // Create a Date object
    const dateObj = new Date(`${year}-${month}-${day}T12:00:00.000Z`);
    console.log('dateObj', dateObj)

    // Convert to ISO format and encode for URL
    const isoDateString = dateObj.toISOString();
    const encodedDate = encodeURIComponent(isoDateString);

    return { encodedDate, isoDateString };

}

export function convertMMMEnFr(monthMMMMEn) {

    let monthMMMMfr

    // Convert month from English to French
    const monthNamesInFrench = {
        'January': 'janvier',
        'February': 'février',
        'March': 'mars',
        'April': 'avril',
        'May': 'mai',
        'June': 'juin',
        'July': 'juillet',
        'August': 'août',
        'September': 'septembre',
        'October': 'octobre',
        'November': 'novembre',
        'December': 'décembre'
    };

    return monthMMMMfr = monthNamesInFrench[monthMMMMEn]
}

export function getPrevCurNextMonth(date) {

    // Get the current date
    var currentDate = new Date();

    // Get the first day of the current month
    var firstDayOfCurMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var firstDayOfCurMonth = {
        UnixTs: moment(firstDayOfCurMonthDate).valueOf(),
        StrDDMMYYYY: moment(firstDayOfCurMonthDate).format('DD/MM/YYYY'),
        StrMMMMYYYY: moment(firstDayOfCurMonthDate).format('MMMM/YYYY')
    };

    // Get the first day of the previous month
    var firstDayOfPrevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    var firstDayOfPrevMonth = {
        UnixTs: moment(firstDayOfPrevMonthDate).valueOf(),
        StrDDMMYYYY: moment(firstDayOfPrevMonthDate).format('DD/MM/YYYY'),
        StrMMMMYYYY: moment(firstDayOfPrevMonthDate).format('MMMM/YYYY')
    };

    // Get the first day of the next month
    var firstDayOfNextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    var firstDayOfNextMonth = {
        UnixTs: moment(firstDayOfNextMonthDate).valueOf(),
        StrDDMMYYYY: moment(firstDayOfNextMonthDate).format('DD/MM/YYYY'),
        StrMMMMYYYY: moment(firstDayOfNextMonthDate).format('MMMM/YYYY')
    };

    // Get the first day of M+2
    var firstDayOfMonthAfterNextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
    var firstDayOfMonthAfterNext = {
        UnixTs: moment(firstDayOfMonthAfterNextDate).valueOf(),
        StrDDMMYYYY: moment(firstDayOfMonthAfterNextDate).format('DD/MM/YYYY'),
        StrMMMMYYYY: moment(firstDayOfMonthAfterNextDate).format('MMMM/YYYY')
    };

    // Return the dates as an object
    return {
        firstDayOfCurMonth: firstDayOfCurMonth,
        firstDayOfPrevMonth: firstDayOfPrevMonth,
        firstDayOfNextMonth: firstDayOfNextMonth,
        firstDayOfMonthAfterNext: firstDayOfMonthAfterNext
    };

}









