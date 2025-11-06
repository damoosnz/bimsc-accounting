

export function knackApiHelperProgressCbPercent(progress, len, fetchResult, viewKey) {
    const pgr = (progress / len * 100);
    console.log('progress is running', pgr);
    return updatePopupProgress(viewKey, pgr);
}

export default function updatePopupProgress(viewKey,progress) {
    $('#popup-progress-bar-' + viewKey).css('width', progress + '%');
    $('#progress-text-' + viewKey).text(Math.round(progress) + '%');
}