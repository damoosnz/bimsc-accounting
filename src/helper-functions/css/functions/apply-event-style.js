export default function applyEventStyle($el, elStyle, evtStyle) {

    if (!$el || !$el.length) {
        console.warn('Invalid element passed');
        return;
    }

    if (typeof elStyle !== 'function') {
        console.warn('Invalid element style passed');
        return;
    }

    if (!evtStyle) {
        console.warn(`Unknown event type: "${evtStyle}"`);
        return;
    }

    $el.css(elStyle(evtStyle))

}