const baseLibUrl = "https://damoosnz.github.io/bimsc-html-library/"

export async function loadHTML(libUrl, fileName, returnType = 'jQuery') {

    const url = baseLibUrl + libUrl + fileName

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to load ${fileName}`)
        }
        const data = (await response.text()) // .trim()

        if (returnType === 'raw') return data

        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'text/html')

        // Wrap <html> in jQuery
        const $html = $(doc.documentElement)
        return $html 

    } catch (error) {
        console.error("Error loading HTML file:", error)
        throw error
    }
}