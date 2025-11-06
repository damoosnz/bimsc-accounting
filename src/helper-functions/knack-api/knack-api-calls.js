import KnackAPI from 'https://cdn.skypack.dev/knack-api-helper@3.0.0'
import { _fetch } from './fetch.js'
import { fields } from './knack-api-fields.js';
import { netlify } from '../netlify/netlify-request.js';

const log = false

// GET
//      GET SINGLE
async function knackApiViewGetSingle(payload, log = false) {

    const logger = createApiLogger('GET-SINGLE', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        const res = await knackAPI.get(payload)
        logger.completed()
        return res.json.records?.[0] ?? res.json ?? null;
    } catch (err) {
        logger.failed(err)
        return null;
    }

}
//      GET MANY
async function knackApiViewGetMany(payload, returnType = 'records') {

    const logger = createApiLogger('GET-MANY', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        // throw new Error("Simulated failure in knackApiViewGetMany");
        const res = await knackAPI.getMany(payload);
        logger.completed()

        if (returnType === 'records') return res.records
        if (returnType === 'length') return res.pages[0].json.total_records
    } catch (err) {
        logger.failed(err)
        return null;
    }
}
//      GET MANY PARENT RECORDS
export async function knackApiViewGetManyParentRecord(payload, log = false) {

    const logger = createApiLogger('GET-MANY-FROM-PARENT', Date.now(), log, payload);
    logger.started()

    const basePayload = payload.url

    var iteration = 1
    let iterationUrl = `&page=${iteration}&rows_per_page=1000`
    let currentPayload = basePayload + iterationUrl
    var response = {}

    try {

        const res = await _fetch.one(knackFetchReq('GET', currentPayload))
        response = { ...res }

        if (res.json.total_pages > 1) {
            for (var i = 2; i <= res.json.total_pages; i++) {
                iterationUrl = `&page=${i}&rows_per_page=1000`
                currentPayload = basePayload + iterationUrl
                const iterationRes = await _fetch.one(knackFetchReq('GET', currentPayload))
                response.json.records = [...response.json.records, ...iterationRes.json.records];
            }
        }
        logger.completed()
        return response.json.records

    } catch (err) {
        logger.failed(err)
        return null;
    }

}
//      GET MANY FROM REPORT VIEW
export async function knackApiViewGetFromReport(payload, log = false) {

    let logger

    if (payload.isFilters) {

        logger = createApiLogger('GET_MANY_REPORT-FILTERS', Date.now(), log, payload);
        logger.started()
        try {
            const resFilters = await _fetch.one(knackFetchReq('GET', payload.url))
            logger.completed()
            return resFilters.json.report.records
        } catch (err) {
            logger.failed(err)
            return null;
        }

    } else {

        logger = createApiLogger('GET_MANY_REPORT', Date.now(), log, payload);
        logger.started()
        const knackAPI = newKnackApi()
        try {
            const res = await knackAPI.getFromReportView(payload)
            logger.completed()
            return res.json.reports[0].records
        } catch (err) {
            logger.failed(err)
            return null;
        }

    }

}

// POST
//      POST SINGLE
export async function knackApiViewPostSingle(payload, log = false) {

    const logger = createApiLogger('POST-SINGLE', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        const response = await knackAPI.post(payload);
        const recordCreated = response.json;
        logger.completed()
        return recordCreated
    } catch (err) {
        logger.failed(err)
        return null;
    }

}
//      POST MANY
export async function knackApiViewPostMany(payload, log = false) {

    const logger = createApiLogger('POST-MANY', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        const responses = await knackAPI.postMany(payload);
        if (responses.summary.rejected > 0) {
            const total = responses.summary.rejected + responses.summary.fulfilled
            const failed = responses.summary.rejected
            logger.failed(new Error(`failed ${failed} out of ${total} `));
        }
        logger.completed()
        return responses
    } catch (err) {
        logger.failed(err)
        return null;
    }

}

// PUT
//      PUT SINGLE
export async function knackApiViewPutSingle(payload, log = false) {

    const logger = createApiLogger('PUT-SINGLE', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        const response = await knackAPI.put(payload);
        logger.completed()
        return response.json.record
    } catch (err) {
        logger.failed(err)
        return null;
    }

}
//      PUT MANY
export async function knackApiViewPutMany(payload, log = false) {

    const logger = createApiLogger('PUT-MANY', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        const responses = await knackAPI.putMany(payload);
        if (responses.summary.rejected > 0) {
            const total = responses.summary.rejected + responses.summary.fulfilled
            const failed = responses.summary.rejected
            logger.failed(new Error(`failed ${failed} out of ${total} `));
        }
        logger.completed()
        return responses
    } catch (err) {
        logger.failed(err)
        return null;
    }

}

// DELETE
//      DELETE SINGLE
export async function knackApiViewDeleteSingle(payload, log = false) {

    const logger = createApiLogger('DELETE-SINGLE', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        const response = await knackAPI.delete(payload)
        logger.completed()
        return response
    } catch (err) {
        logger.failed(err)
        return null;
    }
}
//      DELETE MANY
export async function knackApiViewDeleteMany(payload, log = false) {

    const logger = createApiLogger('DELETE-MANY', Date.now(), log, payload);
    const knackAPI = newKnackApi()
    logger.started()
    try {
        const response = await knackAPI.deleteMany(payload)
        logger.completed()
        return response
    } catch (err) {
        logger.failed(err)
        return null;
    }
}

// ASSET
//      uplaod file/image asset
export async function knackUploadAsset(file) {

    var url = `https://api.knack.com/v1/applications/${Knack.application_id}/assets/file/upload`

    const formData = new FormData();
    formData.append('files', file)

    var options = {
        'method': 'POST',
        'headers': {
            'X-Knack-REST-API-Key': 'knack',
            'X-Knack-Application-Id': Knack.application_id,
        },
        'body': formData
    };

    var response = await fetch(url, options);
    var result = await response.json()
    return { id: result.id, url: result.public_url }

}

export const knackApiMethods = {
    // get
    getSingle: (payload) => knackApiViewGetSingle(payload),
    getMany: (payload, returnType) => knackApiViewGetMany(payload, returnType),
    getManyParentRecord: (payload) => knackApiViewGetManyParentRecord(payload),
    getFromReport: (payload) => knackApiViewGetFromReport(payload),
    // post
    postSingle: (payload) => knackApiViewPostSingle(payload),
    postMany: (payload) => knackApiViewPostMany(payload),
    //put
    putMany: (payload) => knackApiViewPutMany(payload),
    putSingle: (payload) => knackApiViewPutSingle(payload),
    // delete
    deleteSingle: (payload) => knackApiViewDeleteSingle(payload),
    deleteMany: (payload) => knackApiViewDeleteMany(payload)

}

export function getApiMethod(postMsgContent, payload) {
    return knackApiMethods[postMsgContent.method](payload)
}

function createApiLogger(callType, callId, log, payload) {

    // Capture the stack and extract the first line outside this file
    const stackLines = (new Error()).stack.split('\n').map(line => line.trim());
    // Find the first stack line that does NOT include 'knack-api-calls.js'
    const origin = stackLines.find(line =>
        line && !line.includes('knack-api-calls.js') && !line.includes('Error')
    );

    const logger = {}
    logger.failed = (err) => {
        console.log(`api call: `, { status: 'FAILED', type: callType, callid: callId, origin, error: err })

        // const currentScene = Knack.scenes.models.find(scene => scene.attributes.slug === Knack.getCurrentScene().slug);
        //   const sceneKey = currentScene.attributes.key;
        //   const sceneName = currentScene.attributes.name;
        //   const sceneBuilderUrl = `https://builder.knack.com/${Knack.account.name}/${Knack.app.attributes.slug}/pages/${sceneKey}`;




        const rec = {}
        rec[fields.apiErr.callType_2797.key] = callType
        rec[fields.apiErr.callOrigin_2839.key] = origin
        rec[fields.apiErr.callErr_2840.key] = err?.message || String(err)
        rec[fields.apiErr.callUrl_2841.key] = window.location.href
        rec[fields.apiErr.callUser_2795.key] = Knack.session.user.id
        if (payload) {
            rec[fields.apiErr.callPayload_2842.key] = JSON.stringify(payload)
        }

        const req = netlify('POST', 'api-error', rec)
        const resRaw = fetch(req.url, req.request)

    }

    if (log) {
        logger.started = () => console.log(`api call: `, { status: 'STARTED', type: callType, callid: callId, origin })
        logger.completed = () => console.log(`api call: `, { status: 'COMPLETED', type: callType, callid: callId, duration: Date.now() - callId, origin })
    }

    if (!log) {
        logger.started = () => { }
        logger.completed = () => { }
    }

    return logger
}

async function fetchAPIcall(payload, headers, logger) {

    logger.started()

    try {
        const response = await fetch(payload, {
            method: 'GET',
            headers,
        });
        const responseJson = await response.json();
        logger.completed()
        return responseJson
    } catch (err) {
        logger.failed(err)
        return err
    }
}

function knackAPIReqHeaders() {
    return {
        'Authorization': Knack.getUserToken(),
        'X-Knack-REST-API-Key': 'knack',
        'X-Knack-Application-Id': Knack.application_id,
        'Content-Type': 'application/json'
    };
}

function newKnackApi() {
    return new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });
}

function knackFetchReq(method, url, retries = 5) {

    return {
        url,
        options: {
            method: method,
            headers: knackAPIReqHeaders()
        },
        retries,
    }

}


