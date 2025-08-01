import { knackApiHelperProgressCbPercent } from "./knack-api-progress-report.js";


// Put
export function createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        recordId: record_id,
        body: recordData,
    }
    return payload
}
export function createApiPayloadPutMany(sceneKey, viewKey, records, progress) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        records: records,
    }
    // if (progress) { payload.progressCbs: progress[0].map(callback => (progress, len, fetchResult) => callback(progress, len, fetchResult, progress[1])) }
    return payload

}


// Post
export function createApiPayloadPostSingle(sceneKey, viewKey, record) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        body: record,
    }
    return payload

}
export function createApiPayloadPostMany(sceneKey, viewKey, records) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        records: records
    }
    return payload

}
//get
export function createApiPayloadGetSingle(sceneKey, viewKey, record_id) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        recordId: record_id,
    }
    return payload

}
export function createApiPayloadGetMany(sceneKey, viewKey, filters, parentRecord, format) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    if (parentRecord) {
        var url = `https://api.knack.com/v1/pages/${sceneKey}/views/${viewKey}/records?${parentRecord.name}_id=${parentRecord.id}`
        if (filters) { // Check if filters is not empty
            url += '&filters=' + encodeURIComponent(JSON.stringify(filters)); // Use & instead of ?
        }
        // console.log('params', sceneKey, viewKey, filters , parentRecord , format)
        // console.log('payload', url)
        return url

    } else {

        if (!format) { format = 'both' }
        const payload = {
            scene: sceneKey,
            view: viewKey,
            format: format,
        }
        if (filters) { payload.filters = filters }
        // console.log('params', sceneKey, viewKey, filters , parentRecord , format)
        // console.log('payload', payload)
        return payload
    }
}
//delete
export function createApiPayloadDeleteSingle(sceneKey, viewKey, record) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        recordId: record.id,
        scene: sceneKey,
        view: viewKey,//view_21 is a view with a delete link like a grid or details view
    }
    return payload
}

//report
export function createApiPayloadGetFromReportFilters(sceneKey, viewKey, filters = {}) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    if (filters) {

        const baseUrl = `https://api.knack.com/v1/scenes/${sceneKey}/views/${viewKey}/report/0`
        const apiUrl = baseUrl + '?filters=' + encodeURIComponent(JSON.stringify(filters));
        return { url: apiUrl, filters: true }

    } else {

        const payload = {
            scene: sceneKey,
            view: viewKey,
        }
        return payload

    }
}

function createApiPayloadGetFromReport(sceneKey, viewKey, filters = {}) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
    }
    return payload

}



export const knackApiPayloads = {
    // get
    getSingle: (sceneKey, viewKey, record_id) => createApiPayloadGetSingle(sceneKey, viewKey, record_id),
    getMany: (sceneKey, viewKey, filters, parentRecord, format) => createApiPayloadGetMany(sceneKey, viewKey, filters, parentRecord, format),
    getFromReport: (sceneKey, viewKey) => createApiPayloadGetFromReport(sceneKey, viewKey),
    getFromReportFilters: (sceneKey, viewKey, filters) => createApiPayloadGetFromReportFilters(sceneKey, viewKey, filters),
    // post
    postSingle: (sceneKey, viewKey, record) => createApiPayloadPostSingle(sceneKey, viewKey, record),
    postMany: (sceneKey, viewKey, records) => createApiPayloadPostMany(sceneKey, viewKey, records),
    // delete
    deleteSingle: (sceneKey, viewKey, record) => createApiPayloadDeleteSingle(sceneKey, viewKey, record),
    // put
    putSingle: (sceneKey, viewKey, record_id, recordData) => createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData),
    putMany: (sceneKey, viewKey, records, progress) => createApiPayloadPutMany(sceneKey, viewKey, records, progress)
};


// get the scene object from the view object

function getSceneFromView(sceneKey, viewKey) {

    const scenes = Knack.scenes.models
    const scene = scenes.find(s => {
        return s.views.models.some(v => v.attributes.key === viewKey);
    })
    const sceneKeyCheck = scene.attributes.key

    if (sceneKeyCheck === sceneKey) {
        return sceneKey
    } else {
        console.log('api payload - scenekey MISMATCH', sceneKeyCheck, sceneKey, sceneKeyCheck === sceneKey)
        return sceneKeyCheck
    }

    // using the views route
    // [115].views.models[0].attributes.key
    // using the attributes route
    // [107].attributes.views[0].key

}

//  TO DELETE
export function getApiPayload(postMsgContent) {
    console.log('creating for payload for ' + postMsgContent.method)
    return knackApiPayloads[postMsgContent.method](postMsgContent.payload);
}

