
import { addCheckboxes } from "./tables-functions.js";
import { handleHeaderCheckboxChange } from "./tables-functions.js";
import { getTableCheckedRecords } from "./tables-functions.js";
import { addFilterToTableView } from "./tables-functions.js";
import { reRenderTableOrCalendar } from "./tables-functions.js";
import { setFilterToTableView } from "./tables-functions.js";

export const tables = {
    addCheckboxes : (view) => addCheckboxes(view),
    addHeadEventHandler: (view, rules) => handleHeaderCheckboxChange(view, rules),
    getChechedRecords: (view) => getTableCheckedRecords(view),
    addFilters :(view, filters) => addFilterToTableView(view, filters),
    setFilters: (view, filters) => setFilterToTableView(view, filters),
    reRender: (view) => reRenderTableOrCalendar(view), 
}
