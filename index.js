import { knackApi } from "bimsc-knack-api";
import { knackInterface } from "bimsc-knack-interface";
import { bimscJs } from "bimsc-js-utils";

window.knackApi = knackApi;
window.knackInterface = knackInterface;
window.bimscJs = bimscJs;

import './src/renders/add-transaction-render.js'
import './src/renders/check-duplicates.js'
import './src/renders/update-transaction-types.js'
import './src/renders/view-transaction-details.js'
import './src/renders/populate-transations-info.js'

