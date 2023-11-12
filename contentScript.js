// Listen for a message from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "scrapeEmails") {
        scrapeEmails().then(scrapedEmails => {
            console.log("in listener Scraped emails:", scrapedEmails);
            if (scrapedEmails.length > 0) {
                chrome.runtime.sendMessage({emails: scrapedEmails});
            } else {
                chrome.runtime.sendMessage({message: "No emails found"});
            }
        });
    }
});


// Scrapuu
function scrapeEmails() {
    return new Promise((resolve, reject) => {
        // local storage secure af async so need promise 
        chrome.storage.local.get("emailType", function(data) {
            var emailType = data.emailType || 'all';
            var emailRegex;
            // in case you want a specific email extension, modify the code here
            // :/[a-zA-Z0-9._-]+@gmail\.[a-zA-Z]{2,6}/g
            // :/[a-zA-Z0-9._-]+@gmail\.com/g
            switch (emailType) {
                case 'gmail':
                    emailRegex = /[a-zA-Z0-9._-]+@gmail\.[a-zA-Z]{2,6}/g;
                    break;
                case 'outlook':
                    emailRegex = /[a-zA-Z0-9._-]+@outlook\.[a-zA-Z]{2,6}/g;
                    break;
                case 'hotmail':
                    emailRegex = /[a-zA-Z0-9._-]+@hotmail\.[a-zA-Z]{2,6}/g;
                    break;
                default:
                    emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
                    break;
            }
    
            const pageText = document.body.innerText;
            const emails = pageText.match(emailRegex) || [];
            console.log("in function Scraped emails:", emails);
            resolve(emails);
        });
    });
}

