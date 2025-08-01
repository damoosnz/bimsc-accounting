// define the structure of the netlify request object

export function netlify(method, process, data) {

    const netlify = {
        url: 'https://bimsc-fas.netlify.app/.netlify/functions/' + process,
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

