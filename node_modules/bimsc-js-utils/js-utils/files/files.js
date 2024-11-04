import Papa from 'papaparse';

// Function to parse the CSV text into an array of objects
function parseCSV(csvText, convertNumber) {

    // Parse the CSV data using PapaParse
    const parsedData = Papa.parse(csvText, {
        header: true,          // Treat the first row as headers
        skipEmptyLines: true,  // Skip any empty rows
        dynamicTyping: convertNumber    // Automatically convert numeric values
    });
    return parsedData.data;  // Return parsed data if needed
}

// Function to fetch and process the CSV file
async function fetchCSV(url) {
    try {
        // Fetch the CSV file from the given URL
        const response = await fetch(url);

        // Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the CSV content as text
        const csvText = await response.text();
        return csvText.trim()

    } catch (error) {
        console.error('Error fetching the CSV file:', error);
    }
}

function cleanCSV(csvObj) {
    const cleanedData = csvObj.map(entry => {
        const cleanedEntry = {};

        // Loop through each key-value pair in the object
        for (let [key, value] of Object.entries(entry)) {
            // Clean the key and value by removing \r and trimming whitespace
            try {
                const cleanKey = key.replace(/\r/g, '').trim();
                const cleanValue = value.replace(/\r/g, '').trim();
                cleanedEntry[cleanKey] = cleanValue;
            } catch (err) {
                cleanedEntry[key] = value;
            }


        }

        return cleanedEntry;
    });

    return cleanedData; // Return the cleaned data
}

function jsonToHtml(json) {
    const jsonObject = JSON.parse(json);
    return `<pre>${JSON.stringify(jsonObject, null, 2)}</pre>`;
}

export const files = {
    parseCSV: (csvContent, convertNumbers) => parseCSV(csvContent, convertNumbers),
    fetchCSV: (url) => fetchCSV(url),
    cleanCSV: (csvObj) => cleanCSV(csvObj),
    jsonToHtml : (jsonContent)=> jsonToHtml(jsonContent)
}