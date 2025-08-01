// map of the knack fields to ma code more readable and replace the field_key by a field label in code


const fields = {
    jobs: {
        uid_329: 'field_329',
        date_338: 'field_338',
        startDate: 'field_2298',
        endDate: 'field_2300',
        year_1155: 'field_1155',
        month_1154: 'field_1154',
        site_510: 'field_510',
        prestUser_538: 'field_538',
        prixHT_655: 'field_655',
        prixTTC_1274: 'field_1274',
        hrRate_1940: 'field_1940',
        tva_1842: 'field_1842',
        numHrs_343: 'field_343',
        statusNum_641: 'field_641',
        domaine_149: 'field_149'
    },
    sites: {
        uid: 'field_1038',
        reqDip: "field_2267",
    },
    jobCats: {
        uid: 'field_1189',
        dipReq: 'field_2219',
    },
    pu: {
        uid: 'field_953',
        dipAct: 'field_2224',
        attVig: 'field_2341',
        bankModif_2730: 'field_2730',
    },
    quals: {
        uid: 'field_1552',
        act: 'field_2212',
        app: 'field_702',
        qualCat: 'field_2211',
    },
    qualCats: {
        uid: 'field_2175',
        actMul: 'field_2682',
        expMul: 'field_2222',
        name: 'field_2174',
    },
    recaps: {
        period_1021: 'field_1021'
    },
    recapBatches: {
        iteration_2510: 'field_2510'
    },
    recapItems: {
        uid_1023: 'field_1023',
        recap_1024: 'field_1024',
        batch_2537: 'field_2537',
        jobs_2182: 'field_2182',
        prestUser_1025: 'field_1025',
        site_1026: 'field_1026',
        invNum_1028: 'field_1028',
        totalHT: 'field_1033',
        avgTVA: 'field_1034',
        totalTTC: 'field_1035',
        jobsCount: 'field_1037',
        jobsList: 'field_1114',
        hrRate: 'field_2137',
        totalHrs: 'field_2178',
        marker: 'field_2412',
    },
    siteActPu: {
        statusNum_2451: 'field_2451',
        lastRun_2449: 'field_2449',
        prestUsers_2464: 'field_2464',
    }


}

function normalizeFields(obj) {
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const val = obj[key];
        if (typeof val === 'object' && val !== null) {
            normalizeFields(val);
        } else if (typeof val === 'string' && /^field_\d+$/.test(val)) {
            obj[key] = {
                key: val,
                raw: `${val}_raw`
            };
        }
    }
}

normalizeFields(fields)

export { fields };

