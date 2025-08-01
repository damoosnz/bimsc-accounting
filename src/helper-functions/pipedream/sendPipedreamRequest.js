export const pd = {
  routeTo: {
    jobCampaign: 'https://eo1wnx7k40uu08l.m.pipedream.net',
    massSelection: 'https://eow31n5i6dmb026.m.pipedream.net',
    freshDeskTicketCreate: 'https://eozu7c2n87fkxsj.m.pipedream.net',
    freshDeskTicketReply: 'https://eol3pd9gwb5ui64.m.pipedream.net',
    endPropsOnValidation: 'https://eo4pixfzvpt74to.m.pipedream.net',
    pricingAnalysis: 'https://eo61pljwl9h0729.m.pipedream.net',
    uploadPlgToDrive: 'https://eo98604ae0y7x2f.m.pipedream.net'
  },
  send: (urlDirect, postData) => sendPipedreamRequest(urlDirect, postData)
}

// pipedream webhook function

export default async function sendPipedreamRequest(urlDirect, postData) {

  // Options for the fetch request
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // Add other headers as needed
    },
    body: JSON.stringify(postData)
  };

  // Make a POST request to the server

  try {
    const response = await fetch(urlDirect, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();
    console.log('Response from server:', data);
    return data; // Return the response data
  } catch (error) {
    console.error('There was a problem with the request:', error);
    throw error; // Re-throw the error for handling in the caller
  }

}


