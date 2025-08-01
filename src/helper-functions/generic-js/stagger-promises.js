export async function staggeredAll(promises, delayMs = 125) {
    const results = [];
    for (let i = 0; i < promises.length; i++) {
        // Start each promise with a delay
        if (i > 0) await new Promise(res => setTimeout(res, delayMs));
        results.push(promises[i]);
    }
    return Promise.all(results);
}