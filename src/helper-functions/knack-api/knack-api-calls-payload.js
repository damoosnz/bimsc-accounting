import { knackApiHelperProgressCbPercent } from "./knack-api-progress-report.js";

// PUT
//  SINGLE
function createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        recordId: record_id,
        body: recordData,
    }
    return payload
}
//  MANY
function createApiPayloadPutMany(sceneKey, viewKey, records, progress) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        records: records,
    }
    if (progress) {
        payload.progressCbs = progress
    }

    return payload

}

// POST
//  SINGLE
function createApiPayloadPostSingle(sceneKey, viewKey, record) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        body: record,
    }
    return payload

}
//  MANY
function createApiPayloadPostMany(sceneKey, viewKey, records) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        scene: sceneKey,
        view: viewKey,
        records: records
    }
    return payload

}

// GET
//  SINGLE
// function createApiPayloadGetSingle(sceneKey, viewKey, record_id) {
function createApiPayloadGetSingle({ s, v, r }) {

    s = getSceneFromView(s, v)

    const payload = {
        scene: s,
        view: v,
        recordId: r,
    }
    return payload

}
//  MANY
// function createApiPayloadGetMany(sceneKey, viewKey, filters, parentRecord, format) {
function createApiPayloadGetMany({ s, v, f, p, fmt, m }) {

    s = getSceneFromView(s, v)

    const payload = {
        scene: s,
        view: v,
    }

    if (m) {
        payload.maxRecordsToGet = m
    }

    if (!fmt) { fmt = 'both' }
    payload.format = fmt

    if (p) {
        // var url = `https://api.knack.com/v1/pages/${s}/views/${v}/records?${p.name}_id=${p.id}`
        // payload.url = url
        // payload.IsParent = true
        // payload.parent = p
        // if (f) { // Check if filters is not empty
        //     url += '&filters=' + encodeURIComponent(JSON.stringify(f));
        //     payload.filters = f
        // }

        // return payload
        payload.sceneRecordId = p.id

    }
    // else {

    // const payload = {
    //     scene: s,
    //     view: v,
    // }
    if (f) {
        payload.filters = f
    }
    return payload

}

//  REPORT
function createApiPayloadGetManyReport({ s, v, f }) {

    s = getSceneFromView(s, v)

    if (f) {

        const baseUrl = `https://api.knack.com/v1/scenes/${s}/views/${v}/report/0`
        const apiUrl = baseUrl + '?filters=' + encodeURIComponent(JSON.stringify(f));
        return {
            url: apiUrl,
            isFilters: true,
            scene: s,
            view: v,
            filters: f
        }

    } else {

        return {
            scene: s,
            view: v,
        }

    }
}

// DELETE
//  SINGLE
function createApiPayloadDeleteSingle(sceneKey, viewKey, record) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        recordId: record.id,
        scene: sceneKey,
        view: viewKey,
    }
    return payload
}
// MANY
function createApiPayloadDeleteMany(sceneKey, viewKey, records) {

    sceneKey = getSceneFromView(sceneKey, viewKey)

    const payload = {
        records,
        scene: sceneKey,
        view: viewKey,
    }
    return payload
}







export const knackApiPayloads = {
    // get
    getSingle: ({ s, v, r }) => createApiPayloadGetSingle({ s, v, r }),
    getMany: ({ s, v, f, p, fmt, m }) => createApiPayloadGetMany({ s, v, f, p, fmt, m }),
    getManyReport: ({ s, v, f }) => createApiPayloadGetManyReport({ s, v, f }),
    // post
    postSingle: (sceneKey, viewKey, record) => createApiPayloadPostSingle(sceneKey, viewKey, record),
    postMany: (sceneKey, viewKey, records) => createApiPayloadPostMany(sceneKey, viewKey, records),
    // delete
    deleteSingle: (sceneKey, viewKey, record) => createApiPayloadDeleteSingle(sceneKey, viewKey, record),
    deleteMany: (sceneKey, viewKey, records) => createApiPayloadDeleteMany(sceneKey, viewKey, records),
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

}

//  TO DELETE
export function getApiPayload(postMsgContent) {
    console.log('creating for payload for ' + postMsgContent.method)
    return knackApiPayloads[postMsgContent.method](postMsgContent.payload);
}

