import { getApiMethod } from "./knack-api-calls.js";
import { getApiPayload } from "./knack-api-calls-payload.js";

// scene_1718 view_4158 api endpoints

// Change "scene_1" to the scene you want to listen for
$(document).on('knack-scene-render.scene_1718', function (event, scene) {
    const intervalId = setInterval(() => {
        const header = $("#knack-dist_1 .knHeader");
        const navBar = $("#knack-dist_1 .kn-info-bar")
        if (header.length || navBar.length) {
            header.hide();
            navBar.hide();
            clearInterval(intervalId); // Stop the interval once the element is found and hidden
        }
    }, 25); // Check every 100 milliseconds
});

$(document).on('knack-view-render.view_4158', async function (event, view, data) {

    // retrieve the postMsgContent
    console.log("waiting for message")

    // set the dipsplay properrty to show in the ui iframe
    $('#' + view.key).hide()

    // Add an event listener for the 'message' event
    window.addEventListener('message', async function (event) {
        // Verify the message origin if needed
        // Example: if (event.origin !== 'https://your-iframe-origin') return;

        // Retrieve the message data
        const postMsgContent = JSON.parse(event.data);

        // Log the message for verification
        console.log(event)
        console.log("Received message:", postMsgContent);

        // process the message
        const payload = getApiPayload(postMsgContent)
        console.log('payload', payload)
        const response = await getApiMethod(postMsgContent, payload)
        console.log(response)
    
        if (window.self !== window.top) {
            // Send a message to the parent window
            window.parent.postMessage(JSON.stringify(
                {
                    method: postMsgContent.method,
                    data: response
                })
                , '*');
        console.log('return message sent')
        }

    });

    // const postMsgContentTest = {
    //     method: 'getMany',
    //     payload: {
    //         sceneKey: 'scene_1701',
    //         viewKey: 'view_4110'
    //     }
    // }
    // console.log(postMsgContentTest)



});

