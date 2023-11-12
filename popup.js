// wait for dom to load to attach events
document.addEventListener('DOMContentLoaded', function() {
    var scrapeTabButton = document.getElementById('scrapeTabButton');
    var settingsTabButton = document.getElementById('settingsTabButton');

    scrapeTabButton.addEventListener('click', function() {
        openTab('scrapeTab');
    });

    settingsTabButton.addEventListener('click', function() {
        openTab('settingsTab');
    });

    //contentScript listener
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        const emailList = document.getElementById('emailList');
        console.log("Message received in popup:", message);
        if (message.emails && message.emails.length > 0) {
            emailList.textContent = message.emails.join(', ');
        } else if (message.message) {
            emailList.textContent = message.message;
        }
    });

    document.getElementById('scrapeButton').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "scrapeEmails"});
        });
    });

    document.getElementById('emailType').addEventListener('change', function() {
        var emailType = this.value;
        chrome.storage.local.set({ "emailType": emailType }, function() {
            console.log('Email type is set to ' + emailType);
        });
    });

    openTab('scrapeTab');
});

// Function to open a specific tab
function openTab(tabId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}
