import handleOptions from "./utils/handle-options";
import isLoggedInUser from "./utils/knack-api/is-logged-in-user";
import unauthorizedResponse from "./utils/unauthorized-response";
import KnackAPI from "knack-api-helper";
import getCorsHeaders from "./utils/get-cors-headers";

//Update these to whatever scene and view you want to fetch from
const sceneToFetchFrom = 'scene_3';
const viewToFetchFrom = 'view_4';

exports.handler = async (event, context, callback) => {  

  //When called from browser, a preflight request of type OPTIONS is sent which needs to receive CORS headers
  //Then the main POST is sent
  if (event.httpMethod === 'POST') {
    return handlePost(event)
  } else if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event)
  } else {
    // Handle other HTTP methods here
  }

  async function handlePost(event) {

    //Check the requestor was a logged in Knack user for your app
    if(await isLoggedInUser(event) === true) {

      //The requestor is an authorized Knack user, so proceed with the request
      try {

        //Init a new knack API Helper instance with view-based authentication & the user's token from headers
        //Note: you may instead want to use a higher-priveleged user here by running a knackAPI.login (or used object-based auth)
        const knackAPI = new KnackAPI({
          applicationId: process.env.KNACK_APPLICATION_ID,
          auth: 'view-based',
          userToken: event.headers.authorization
        });

        //Fetch all records from a grid/search view in your app
        const res = await knackAPI.getMany({
          scene: sceneToFetchFrom,
          view: viewToFetchFrom,
          format: 'raw'
        })

        //Send a successful response back to the client
        return {
          statusCode: 200,
          headers: getCorsHeaders(),
          body: JSON.stringify(res.records)
        }

      } catch (err) {

        //Something went wrong
        //Send an error response back to the client
        return {
          statusCode: 500,
          body: JSON.stringify(err)
        }

      }

    } else {
      //The requestor was not a logged in Knack user
      //Send an unauthorized response back to the client
      return unauthorizedResponse();
    
    }
  }
  

};