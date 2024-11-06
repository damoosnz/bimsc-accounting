export const tr_types_map = [
    {
        bank: 'WESTPAC',
        type: '',
        party: ["Other Party"],
        details: ["Particulars", "Analysis (Code)", "Reference"]
    },
    {
        bank: 'WISE',
        type: 'TRANSFER',
        party: ["details.recipient.name"],
        details: ["details.description", "details.paymentReference"]
    },
    {
        bank: 'WISE',
        type: 'MONEY_ADDED',
        party: ["exchangeDetails.fromAmount.currency", "exchangeDetails.toAmount.currency"],
        details: ["details.description", "exchangeDetails.fromAmount.currency", "exchangeDetails.fromAmount.value",
            "exchangeDetails.toAmount.currency", "exchangeDetails.toAmount.value"]
    },
    {
        bank: 'WISE',
        type: 'DEPOSIT',
        party: ["details.senderName"],
        details: ["details.description", "details.senderAccount", "details.paymentReference"]
    },
    {
        bank: 'WISE',
        type: 'CARD',
        party: ["details.merchant.name"],
        details: ["details.description", "details.category"]
    },
    {
        bank: 'WISE',
        type: 'CONVERSION',
        party: ["details.description"],
        details: ["details.description", "details.sourceAmount.value", "details.sourceAmount.currency",
            "details.targetAmount.value", "details.targetAmount.currency", "details.rate"]
    },
    {
        bank: 'WISE',
        type: 'ACCRUAL_CHARGE',
        party: ["details.description"],
        details: ["details.description", "amount.value", "amount.currency"]
    },
]

// const temp = {
//     "type": "DEBIT",
//     "date": "2020-03-06T20:57:34.018672Z",
//     "amount": {
//         "value": -8.76,
//         "currency": "EUR",
//         "zero": false
//     },
//     "totalFees": {
//         "value": 0,
//         "currency": "EUR",
//         "zero": true
//     },
//     "details": {
//         "type": "CONVERSION",
//         "description": "Wise Charges for: BALANCE-82243053",
//         "sourceAmount": {
//             "value": 2000,
//             "currency": "EUR",
//              "zero": false
//         },
//         "targetAmount": {
//             "value": 3539.99,
//             "currency": "NZD", 
//             "zero": false
//         },
//         "rate": 1.77778
//     },
//     "exchangeDetails": null,
//     "runningBalance": {
//         "value": 1991.61,
//         "currency": "EUR", "zero": false
//     },
//     "referenceNumber": "FEE-BALANCE-82243053",
//     "attachment": null, "activityAssetAttributions": []
// }

