import { sendToLocalHost } from "../functions/send-local-request.js";

// acounting

// add wise transactions scene_25 view_37

$(document).on('knack-form-submit.view_37', async function (event, view, record) {
    event.preventDefault(); // Prevent the default form submission
    const url = 'http://localhost:3000/api/accounting/add-wise-transactions'
    const data = {test: 'test'}
    const res = await sendToLocalHost.POST(url,data)
    console.log(res)
});

$(document).on('knack-form-submit.view_39', async function (event, view, record) {
    const url = 'http://localhost:3000/api/accounting/add-westpac-transactions'
    const data = {test: 'test'}
    const res = await sendToLocalHost.POST(url,data)
    console.log(res)
});