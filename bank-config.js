const wpJsonSample =  {
    "Account Number": "0307130019713000",
    "Date": {
      "date": "29/12/2016",
      "hours": "12",
      "minutes": "00",
      "am_pm": "AM"
    },
    "Amount": "14553.92",
    "Transaction Code": "",
    "Transaction Type": "CREDIT",
    "Source": "",
    "Other Party": "Asian Engineering Se",
    "Particulars": "As Per Instr",
    "Analysis (Code)": "NZD1455392",
    "Reference": "GP0008291037",
    "Serial Number": "",
    "Account Code": "",
    "Unique ID": "0307130019713000_201612290001"
}

const wsCardJsonSample = {
    "type": "DEBIT",
    "date": "2020-12-04T07:20:26.246081Z",
    "amount": {
      "value": -33.9,
      "currency": "NZD",
      "zero": false
    },
    "totalFees": {
      "value": 0,
      "currency": "NZD",
      "zero": true
    },
    "details": {
      "type": "CARD",
      "description": "Card transaction of NZD issued by Heydon Priest Limite OAKURA",
      "amount": {
        "value": 33.9,
        "currency": "NZD",
        "zero": false
      },
      "category": "Service Stations (with or withou",
      "merchant": {
        "name": "Heydon Priest Limite",
        "firstLine": null,
        "postCode": "4314      ",
        "city": "OAKURA",
        "state": null,
        "country": "NZ",
        "category": "Service Stations (with or withou"
      },
      "cardLastFourDigits": null,
      "cardHolderFullName": null
    },
    "exchangeDetails": null,
    "runningBalance": {
      "value": 261.03,
      "currency": "NZD",
      "zero": false
    },
    "referenceNumber": "CARD-100583619",
    "attachment": null,
    "activityAssetAttributions": []
  }

  const wsTrasferJsonSample = 	
  {
    "type": "DEBIT",
    "date": "2019-07-09T02:39:28.568636Z",
    "amount": {
      "value": -88000,
      "currency": "EUR",
      "zero": false
    },
    "totalFees": {
      "value": 0.63,
      "currency": "EUR",
      "zero": false
    },
    "details": {
      "type": "TRANSFER",
      "description": "Sent money to SCP MA DESTRUHAUT ET VGIROUDDESTRUHAUT  NOTAIRES",
      "recipient": {
        "name": "SCP MA DESTRUHAUT ET VGIROUDDESTRUHAUT  NOTAIRES",
        "bankAccount": "FR61 4003 1000 0100 0014 1593 E55"
      },
      "paymentReference": "Cts1002294 VGD TT",
      "creatorTrackingId": null
    },
    "exchangeDetails": null,
    "runningBalance": {
      "value": 0.37,
      "currency": "EUR",
      "zero": false
    },
    "referenceNumber": "TRANSFER-82576869",
    "attachment": null,
    "activityAssetAttributions": []
  }

  const wsTrasferJsonSampleCr = {
    "type": "CREDIT",
    "date": "2021-10-14T18:58:01.597881Z",
    "amount": {
      "value": 87.89,
      "currency": "AUD",
      "zero": false
    },
    "totalFees": {
      "value": 0,
      "currency": "AUD",
      "zero": true
    },
    "details": {
      "type": "TRANSFER",
      "description": "Wise Charges for: TRANSFER-306979764",
      "recipient": {
        "name": "Wise",
        "bankAccount": ""
      },
      "paymentReference": "RMR Oct 21",
      "creatorTrackingId": null
    },
    "exchangeDetails": null,
    "runningBalance": {
      "value": 10254.82,
      "currency": "AUD",
      "zero": false
    },
    "referenceNumber": "FEE-TRANSFER-306979764",
    "attachment": null,
    "activityAssetAttributions": []
  }