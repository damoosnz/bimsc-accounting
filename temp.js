const config = {
    party: "Other Party",
    details: [
        "Particulars",
        "Analysis (Code)",
        "Reference"
    ]
}

const config_1 = {
    "party": "exchangeDetails.fromAmount.currency + ' to ' + exchangeDetails.toAmount.currency",
    "details": [
        "details.description",
        "exchangeDetails.fromAmount.value",
        "exchangeDetails.fromAmount.currency",
        "exchangeDetails.toAmount.value",
        "exchangeDetails.toAmount.currency",
        "details.rate"
    ]
}

console.log(JSON.stringify(config_1))