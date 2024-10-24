import KnackAPI from 'knack-api-helper';

export default async function isLoggedInUser(event) {

  const userToken = event.headers.authorization;

  if(!userToken) return false;

  //create KnackAPI instance
  const knackAPI = new KnackAPI({
    auth: 'view-based',
    applicationId: process.env.KNACK_APPLICATION_ID,
  });

  //Check the the userToken is a valid logged in user
  const isAuthorized = await knackAPI.validateSession({
    userToken: userToken,
  });

  return isAuthorized;

}