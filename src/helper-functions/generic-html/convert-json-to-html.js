export async function jsonToHtml(string, $el) {
    // 1. Check if JSONFormatter is loaded
    if (!window.JSONFormatter) {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/json-formatter-js@2.5.13/dist/json-formatter.umd.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 2. Parse JSON and create formatter
    console.log({string})
    const obj = JSON.parse(string);
    console.log({obj})
    const formatter = new window.JSONFormatter(obj, 2);

    // 3. Render into target element
    $el.empty().append(formatter.render());
}

