function removePopup(viewKey) {
    $('#' + viewKey + ' .popup-message').remove();
}

function addPopup(viewKey, message, popupType) {
    var divSelector = $('#' + viewKey);

    // Create the popup container element
    var popup = $('<div>').addClass('popup-message');

    // Create the message div
    var messageDiv = $('<div>').html(message).css({
        marginBottom: '20px',
        fontSize: '18px',
        color: '#fff'
    });

    // Create the progress bar container and bar
    var progressBarContainer = $('<div>').addClass('progress-bar-container');
    var progressBar = $('<div>').attr('id', 'popup-progress-bar-' + viewKey).addClass('popup-progress-bar');
    var progressText = $('<div>').attr('id', 'progress-text-' + viewKey).addClass('progress-text').text('0%');

    progressBarContainer.append(progressBar);
    progressBarContainer.append(progressText);
    popup.append(messageDiv);
    if (popupType === 'progress') {
        popup.append(progressBarContainer);
        console.log('progress popup')
    }

    // Create spinner widget
    var spinnerContainer = $('<div>').addClass('spinner-container');
    var spinner = $('<i>').addClass('fa fa-spinner fa-spin spinner').attr('id', 'popup-spinner-' + viewKey);
    spinnerContainer.append(spinner)
    if (popupType === 'spinner') {
        popup.append(spinnerContainer);
        console.log('spinner popup')
    }

    console.log(popup.html())

    divSelector.css('position', 'relative').append(popup);
}

function updatePopupProgress(viewKey, progress) {
    $('#popup-progress-bar-' + viewKey).css('width', progress + '%');
    $('#progress-text-' + viewKey).text(Math.round(progress) + '%');
}

const popup = {
    add: (viewKey, message, popupType) => addPopup(viewKey, message, popupType),
    remove: (viewKey) => removePopup(viewKey),
    update: (viewKey, progress) => updatePopupProgress(viewKey, progress)
}

export {popup}