function isTrafficLightColor($el, elType) {
    if (!$el || !$el.length) return false;

    // Get computed background color (rgb format)
    const bgColor = $el.css('background-color');

    for (const evtType in trafficLightStyles) {
        if (!trafficLightStyles.hasOwnProperty(evtType)) continue;

        const expectedColor =
            elType === 'container'
                ? trafficLightStyles[evtType].container.backgroundColorRgb
                : trafficLightStyles[evtType].button.backgroundColorRgb;

        if (bgColor === expectedColor) {
            return evtType; // returns 'stop', 'caution', or 'go' if matched
        }
    }

    return false; // no match found
}