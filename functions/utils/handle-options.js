//Helper function to handle a pre-flight OPTIONS request sent by browser before a POST request is sent
//Builds the appropriate 200 response for the OPTIONS request, that includes permissive CORS headers

import getCorsHeaders from "./get-cors-headers"

export default function handleOptions(event) {
  return {
      statusCode: 200,
      headers: {
          ...getCorsHeaders(),
      },
  }
}