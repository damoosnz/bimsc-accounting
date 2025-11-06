// define the structure of the netlify request object

export function netlify(method, process, data) {

    const devMode = localStorage.getItem('knackDevMode');
    console.log('devMode',devMode)
    let url = 'https://bimsc-fas.netlify.app/.netlify/functions/' + process
    if (devMode === 'true') {
        url = 'http://localhost:8888/.netlify/functions/'+ process
    }

    const netlify = {
        url,
        devUrl: 'http://localhost:8888/.netlify/functions/'+ process,
        request: {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": Knack.getUserToken()
            },
            body: JSON.stringify({
                data: data
            })
        }
    }

    return netlify

}

