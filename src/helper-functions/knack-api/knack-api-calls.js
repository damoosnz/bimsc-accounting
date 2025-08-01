import KnackAPI from 'https://cdn.skypack.dev/knack-api-helper@2.2.4'

function createApiLogger(callType, callId) {
    // Capture the stack and extract the first line outside this file
    const stackLines = (new Error()).stack.split('\n').map(line => line.trim());
    // Find the first stack line that does NOT include 'knack-api-calls.js'
    const origin = stackLines.find(line =>
        line && !line.includes('knack-api-calls.js') && !line.includes('Error')
    );

    return {
        started: () => console.log(`api call: `, { status: 'STARTED', type: callType, callid: callId, origin }),
        completed: () => console.log(`api call: `, { status: 'COMPLETED', type: callType, callid: callId, duration: Date.now() - callId, origin }),
        failed: (err) => console.log(`api call: `, { status: 'FAILED', type: callType, callid: callId, origin, error: err })
    };
}


// get
export async function knackApiViewGetSingle(payload) {

    const logger = createApiLogger('GET-SINGLE', Date.now());

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });

    logger.started()

    try {

        const response = await knackAPI.get(payload)
        logger.completed()
        const responseJson = response.json
        return responseJson

    } catch (err) {
        logger.failed()
        return null;
    }

}
export async function knackApiViewGetMany(payload) {

    const logger = createApiLogger('GET-MANY', Date.now());

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });

    logger.started()

    try {
        const resRecords = await knackAPI.getMany(payload);
        logger.completed()
        return resRecords.records
    } catch (err) {
        logger.failed()
        return null;
    }
}




export async function knackApiViewGetManyParentRecord(payload) {

    const basePayload = payload
    var iteration = 1
    var iterationUrl = `&page=${iteration}&rows_per_page=1000`
    var currentPayload = basePayload + iterationUrl
    var headers = {
        'Authorization': Knack.getUserToken(),
        'X-Knack-REST-API-Key': 'knack',
        'X-Knack-Application-Id': Knack.application_id,
        'Content-Type': 'application/json'
    };
    var response = {}

    var responseJson = await fetchAPIcall(currentPayload, headers)
    response = { ...responseJson }

    if (responseJson.total_records > 1000) {
        const numIteration = responseJson.total_pages
        for (var i = 2; i <= numIteration; i++) {
            var iteration = i
            var iterationUrl = `&page=${iteration}&rows_per_page=1000`
            var currentPayload = basePayload + iterationUrl
            responseJson = await fetchAPIcall(currentPayload, headers)
            response.records = [...response.records, ...responseJson.records];
        }
    }

    return response

}

// post
export async function knackApiViewPostMany(payload) {

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });

    console.log("api call started")

    try {

        const responses = await knackAPI.postMany(payload);

        if (responses.summary.rejected > 0) {
            res.summary.errors.forEach(err => {
                errorHandler(err.reason);
            })
        }
        console.log("api call completed")
        return responses

    } catch (err) {
        console.log("api call failed", err)
        return null;
    }

}
export async function knackApiViewPostSingle(payload) {

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });

    console.log("api call started")

    try {

        const response = await knackAPI.post(payload);
        const recordCreated = response.json;
        console.log("api call completed")
        return recordCreated

    } catch (err) {
        console.log("api call failed", err)
        return null;
    }

}

// put
export async function knackApiViewPutSingle(payload) {

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });

    console.log("api call started")

    try {

        const response = await knackAPI.put(payload);
        const responseJson = await response.json

        console.log("api call completed")
        return responseJson

    } catch (err) {
        console.log("api call failed", err)
        return null;
    }

}

export async function knackApiViewPutMany(payload) {

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });

    console.log("api call started")

    try {

        const responses = await knackAPI.putMany(payload);

        if (responses.summary.rejected > 0) {
            res.summary.errors.forEach(err => {
                errorHandler(err.reason);
            })
        }
        console.log("api call completed")
        return responses

    } catch (err) {
        console.log("api call failed", err)
        return null;
    }

}

// delete
export async function knackApiViewDeleteSingle(payload) {

    const knackAPI = new KnackAPI({
        auth: 'view-based',
        applicationId: Knack.application_id,
        userToken: Knack.getUserToken()
    });

    console.log("api call started")

    try {

        const response = await knackAPI.delete(payload)
        console.log("api call completed")
        return response

    } catch (err) {
        console.log("api call failed", err)
        return null;
    }

}

// report
export async function knackApiViewGetFromReport(payload) {

    if (payload.filters) {

        console.log("api call made from url")

        var headers = {
            'Authorization': Knack.getUserToken(),
            'X-Knack-REST-API-Key': 'knack',
            'X-Knack-Application-Id': Knack.application_id,
            'Content-Type': 'application/json'
        };

        var responseJson = await fetchAPIcall(payload.url, headers)
        var records = responseJson.report.records
        return records

    } else {

        const knackAPI = new KnackAPI({
            auth: 'view-based',
            applicationId: Knack.application_id,
            userToken: Knack.getUserToken()
        });

        console.log("api call started")

        try {

            const reportDataResponse = await knackAPI.getFromReportView(payload)
            console.log("api call completed")
            const response = reportDataResponse.json.reports[0].records
            return response

        } catch (err) {
            console.log("api call failed", err)
            return null;
        }

    }



}

// uplaod file/image asset
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
    console.log(response)
    var result = await response.json()
    console.log(result)
    return { id: result.id, url: result.public_url }

}

async function fetchAPIcall(payload, headers) {
    console.log("api call started")
    try {
        const response = await fetch(payload, {
            method: 'GET',
            headers,
        });
        const responseJson = await response.json();
        console.log("api call completed")
        return responseJson
    } catch (err) {
        console.log("api call failed")
        console.log("err", err)
        return err
    }
}

// error handling

const err = {
    userEmail: '',
    userToken: '',
    errMsg: '',
    errCode: '',
    scene: '',
    view: '',
    lastRecordid: '',
    browser: '',
    stack: '',
}



export const knackApiMethods = {
    // get
    getSingle: (payload) => knackApiViewGetSingle(payload),
    getMany: (payload) => knackApiViewGetMany(payload),
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

}

export function getApiMethod(postMsgContent, payload) {
    return knackApiMethods[postMsgContent.method](payload)
}
