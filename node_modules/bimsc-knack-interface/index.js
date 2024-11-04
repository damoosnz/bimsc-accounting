import { msg } from "./messages/message.js";
import { tables } from "./views/tables/tables.js";


// construct the message object
const knackInterface = {
    msg: msg,
    views: {
        tables: tables
    }
}

export {knackInterface}