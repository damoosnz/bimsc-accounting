const baseLibUrl = "https://damoosnz.github.io/bimsc-html-library/"

export async function loadCssLink(libUrl, fileName, $el = 'head') {

    const cssHref = baseLibUrl + libUrl + fileName
    let $cssLink = $(`link[href="${cssHref}"]`)

    if ($cssLink.length > 0) {
        return $cssLink
    }
    // Only inject if it hasn't already been added
    return new Promise((success, fail) => {
        $cssLink = $('<link>', { rel: 'stylesheet', type: 'text/css', href: cssHref })
            .on('load', () => success($cssLink))
            .on('error',(err) => fail(err))
            .appendTo($el)
    })
}



