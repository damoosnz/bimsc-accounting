import { fields } from "./knack-api-fields.js"


export function createFilters(condition) {
    return {
        "match": condition,
        "rules": []
    }
}

export function Commonfilters(field_key) {

    return {
        isDuringTheCurrentMonth: {
            field: field_key,
            operator: "is during the current",
            type: "month",
        },
        isDuringThePreviousMonth: {
            field: field_key,
            operator: "is during the previous",
            range: "1",
            type: "months",
        },
        isDuringTheNextMonth: {
            field: field_key,
            operator: "is during the next",
            range: "1",
            type: "months",
        },
        isBeforeThePreviousMonth: {
            field: field_key,
            operator: "is before the previous",
            range: "1",
            type: "months",
        },
    }

}

export const rules = {
    job: {
        job_uid: (operator, value) => { return { field: fields.jobs.uid_329.key, operator: operator, value: value } },
        job_date: (operator, value) => { return { field: fields.jobs.date_338.key, operator: operator, value: value } },
        job_site: (operator, value) => { return { field: fields.jobs.site_510.key, operator: operator, value: value } }, 
    },
    presUser: {
        pu_id: (operator, value) => { return { field: fields.pu.uid.key, operator: operator, value: value } },
    },
    quals: {
        active: (operator, value) => { return { field: fields.quals.act.key, operator: operator, value: value } },
    },

}