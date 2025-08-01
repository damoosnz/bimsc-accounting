// import updatePopupProgress from "../../visualisation/functions/update-popup-animation.js";

export function knackApiHelperProgressCbPercent(progress, len, fetchResult, viewKey) {
    const pgr = (progress / len * 100);
    console.log('progress is running', pgr);
    return updatePopupProgress(viewKey, pgr);
}