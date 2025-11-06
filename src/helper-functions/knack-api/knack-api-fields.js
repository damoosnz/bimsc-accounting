const fields = {
    currencies: {
        code_5: 'field_5',
    },
    fy: {
        year_18: 'field_18',
        startDate_20: 'field_20',
        endDate_21: 'field_21'
    },
    profiles: {
        id_263: 'field_263',
        name_264: 'field_264',
        ref_265: 'field_265'
    },
    accounts: {
        profile_274: 'field_274',
        currency_168: 'field_168',
        id_266: 'field_266',
        ref_279: 'field_279',
    },
    trTypes: {
        type_231: 'field_231'
    },
    trParties: {
        name_239: 'field_239',
        hash_255: 'field_255'
    },
    trCategories: {
        code_244: 'field_244',
        name_245: 'field_245',
        hints_289: 'field_289',
    },
    transactions: {
        currency_178: 'field_178',
        fy_237: 'field_237',
        profile_270: 'field_270',
        account_179: 'field_179',
        trType_247: 'field_247',
        trParty_248: 'field_248',
        id_177: 'field_177',
        date_171: 'field_171',
        amount_172: 'field_172',
        forex_271: 'field_271',
        details_236: 'field_236',
        json_228: 'field_228',
        bank_269: 'field_269',
        dir_181: 'field_181',
        categories_288: 'field_288',
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