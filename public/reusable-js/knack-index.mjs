//Manage your Knack code from here, never directly in the Knack builder

const netlifyBaseUrl = 'https://YOUR-PROJECT.netlify.app';

//You can import external packages from URL via skypack CDN
//These will work in the browser due to magic done by skypack
//External imports should be imported in the files they are needed just like in nodejs
import KnackAPI from 'https://cdn.skypack.dev/knack-api-helper@2.2.4'
import axios from 'https://cdn.skypack.dev/axios';

//You can also import local files that are hosted in the public directory
//These local files can, in turn, have their own import dependencies
import { buildHelloString } from "./example/build-hello-string.mjs";

//You can define Knack event handlers like normal
$(document).on("knack-scene-render.any", async function (event, scene) {

  //You can call functions that were imported from local files
  console.log("In-production scene render event in knack-index.mjs " + scene.key);
  console.log(buildHelloString("knack-index.mjs"));

  //You can also call functions that imported from external packages
  const knackAPI = new KnackAPI({
    applicationId: Knack.application_id,
    auth: 'view-based'
  });
  console.log('knackAPi from knack-index.mjs ', knackAPI);

  const res = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
  console.log('axios response from knack-index.mjs', res);

  //You can access browser APIs, since this code is running in the browser
  const fetchRes = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  console.log('fetch response from knack-index.mjs', fetchRes);

  //You can also access the browser window object, therefore you can access the window.Knack object
  console.log('Knack app ID from knack-index.mjs', Knack.application_id);

  //Note that environment variables DO NOT work, because we're writing client-side code here
  console.log('typeof process from knack-index.mjs', typeof process);//Undefined therefore process.env.whatever is not available

  //Call the example Netlify function and log the result
  const functionRes = await fetch(`${netlifyBaseUrl}/.netlify/functions/example`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Knack.getUserToken()
    },
  });
  const functionResJson = await functionRes.json();

  console.log('Netlify function response from knack-index.mjs', functionResJson);

});
