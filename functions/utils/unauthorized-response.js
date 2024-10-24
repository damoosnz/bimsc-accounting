//Helper function to return an unauthorized response to the client
export default unauthorizedResponse = (res) => {
  return {
    statusCode: 401,
    body: JSON.stringify({
      error: 'Unauthorized'
    })
  }
}