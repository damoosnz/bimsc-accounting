import { getFromPage } from "./getThingsFromPage.js"

export const waitFor = {
    tableGrouping: async (view) => {
        const tableGrouped = await getFromPage.element(`#${view.key}-groups-rendered`)
        if (!tableGrouped) {
            return false
        } else {
            return tableGrouped.length > 0
        }
    },
}