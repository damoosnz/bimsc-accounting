async function triggerServerPOST(url, data) {

    try {
        // Await the jQuery POST request

        const res = await fetch(url, {
            method: 'POST', // Specify the method
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(data) // Convert data to JSON string
        });
        const response = await res.text()

        // Handle successful response
        console.log('Success:', response);
        return response
    } catch (error) {
        // Handle error
        console.error('Error:', error);
    }
}

// Define the async function for the request
async function triggerServerGET(url) {

    try {
        // Await the jQuery GET request
        const response = await $.ajax({
            url: url,
            method: 'GET',
        });

        // Handle successful response
        console.log('Success:', response);
    } catch (error) {
        // Handle error
        console.error('Error:', error);
    }
}

export const sendToLocalHost = {
    GET: (url) => triggerServerGET(url),
    POST: (url, data) => triggerServerPOST(url, data)
} 