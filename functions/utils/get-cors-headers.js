//Helper function to build CORS headers for an OPTIONS response see handle-options.js
export default getCorsHeaders = () => {
  return {
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Origin, X-Requested-With",
      "Access-Control-Max-Age": "2592000",
      "Access-Control-Allow-Credentials": "true",
  }
}
