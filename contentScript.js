document.addEventListener('DOMContentLoaded', function() {
    var scrapeTabButton = document.getElementById('scrapeTabButton');
    var settingsTabButton = document.getElementById('settingsTabButton');

    scrapeTabButton.addEventListener('click', function() {
        openTab('scrapeTab');
    });

    settingsTabButton.addEventListener('click', function() {
        openTab('settingsTab');
    });


    openTab('scrapeTab');
});

// Listen for a message from the popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action === "scrapeEmails") {
            const scrapedEmails = scrapeEmails();
            if (scrapedEmails.length > 0) {
                chrome.runtime.sendMessage({emails: scrapedEmails});
            } else {
                chrome.runtime.sendMessage({message: "No emails found"});
            }
        }
    }
);

// Function to scrape emails from the webpage
function scrapeEmails() {
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
    const pageText = document.body.innerText;
    const emails = pageText.match(emailRegex) || [];
    return [...new Set(emails)];
}

function openTab(tabId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove('active-tab');
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    var activeTab = document.getElementById(tabId);
    activeTab.style.display = "block";
    activeTab.classList.add('active-tab');
}
