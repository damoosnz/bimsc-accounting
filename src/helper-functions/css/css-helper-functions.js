import { hideDateAndTimeInCalendarList } from "./functions/hide-date-and-time-in-calendar-list.js";
import { removeTextDecorationInCalendarList } from "./functions/remove-text-decoration-in-calendar-list.js";
import { setBackgroundTransparentForFieldLabels } from "./functions/set-background-transparent-for-fields-labels.js";
import { setMinWidthAutoforFieldLabels } from "./functions/set-min-width-auto-for-fields-labels.js";
import applyEventStyle from "./functions/apply-event-style.js";

export const cssHf = {
    fieldLabels: {
        setBackgroundTransaparent: (view) => setBackgroundTransparentForFieldLabels(view),
        setMinWidthAuto: (view) => setMinWidthAutoforFieldLabels(view)
    },
    calendars:{
        list:{
            hideDateTime: (view) => hideDateAndTimeInCalendarList(view),
            removeTextDecoration: (view) => removeTextDecorationInCalendarList(view)
        }
    },
    style: {
        apply: applyEventStyle,
        get: ''
    }
}

