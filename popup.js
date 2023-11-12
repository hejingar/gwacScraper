document.getElementById('scrapeButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "scrapeEmails"});
    });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    const emailList = document.getElementById('emailList');

    if(message.emails) {
        emailList.textContent = message.emails.join(', ');
    } else if (message.message) {
        emailList.textContent = message.message;
    }
});
