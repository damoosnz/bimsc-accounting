//knack api
import { knackApiPayloads } from "./knack-api/knack-api-calls-payload.js";
import { knackApiMethods } from "./knack-api/knack-api-calls.js";

// knack filters
import { createFilters, rules } from "./knack-api/knack-api-filters.js";
import { Commonfilters } from "./knack-api/knack-api-filters.js";
import { fields } from "./knack-api/knack-api-fields.js";

// progress
import { knackApiHelperProgressCbPercent } from "./knack-api/knack-api-progress-report.js";

// knack ui
import { getFromPage } from "./knack-ui/getThingsFromPage.js";
import { manipViews } from "./knack-ui/knack-object-methods.js";
import { getViewFiltersFromUrl } from "./knack-ui/get-view-filters-from-url.js";
import { waitFor } from "./knack-ui/wait-for-ui-event-complete.js";
import { getViewCustomParams } from "./knack-ui/get-views-params-from-description.js";

// pipedream
import { pd } from "./pipedream/sendPipedreamRequest.js";

// generic
import { stripHTML } from "./generic-html/convert-html-to-string.js";
import { chunkArray } from "./generic-js/chunk-array.js";
import { staggeredAll } from "./generic-js/stagger-promises.js";



export const hf = {
    //knack api
    knAPI: {
        PL: knackApiPayloads,
        calls: knackApiMethods,
        filters: {
            create: (condition) => createFilters(condition),
            common: (field_key) => Commonfilters(field_key),
            rules: rules,
        },
        fields: fields,
        progress: (progress, len, fetchResult, viewKey) => knackApiHelperProgressCbPercent(progress, len, fetchResult, viewKey),
    },
    //knack UI
    knUI: {
        getFromPage: getFromPage,
        manipViews: manipViews,
        getFromUrl: {
            filters: (view, reportIndex) => getViewFiltersFromUrl(view, reportIndex),
        },
        waitFor,
        getViewCustomParams,
    },
    //pipedream
    pd: pd,
    // generic
    generic: {
        html: {
            htmlToText: (html) => stripHTML(html)
        },
        js: {
            chunkArray: (array, chunkSize) => chunkArray(array, chunkSize),
            staggerAll: (promises, delayMs) => staggeredAll(promises, delayMs)
        }
    }

}