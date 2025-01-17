let blockedExtensions = [".pdf", ".docx", ".xls"]; 
const approvedWebsites = ["https://example.com"]; 


chrome.downloads.onCreated.addListener((downloadItem) => {
    try {

        const fileExtension = getFileExtension(downloadItem.filename);
        const sourceUrl = new URL(downloadItem.url);

        if (isBlockedExtension(fileExtension) && !isApprovedWebsite(sourceUrl.hostname)) {
        
            chrome.downloads.cancel(downloadItem.id, () => {
            notifyUser(
                "Download Blocked",
                `The file "${downloadItem.filename}" from "${sourceUrl.hostname}" is not allowed.`
        );
        });
  }
        
    } catch (error) {
        console.error("Unexpected error:", error.message);
    }
  
});

// Get the file extension
function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
}


function isBlockedExtension(extension) {
  return blockedExtensions.includes(extension);
}

function isApprovedWebsite(hostname) {
  return approvedWebsites.some((approvedSite) => hostname.includes(approvedSite));
}


function notifyUser(title, message) {
    alert("heyey")
    console.log("Hellonxej")
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: title,
    message: message
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Virtual Upload Queue Extension Installed");
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_EXTENSIONS") {
    blockedExtensions = message.data; // Update the global extensions list
    console.log("Updated extensions in background.js:", blockedExtensions);

    // Store the updated extensions in Chrome's storage
    chrome.storage.local.set({ blockedExtensions }, () => {
      console.log("Extensions saved to storage:", blockedExtensions);
    });

    sendResponse({ success: true });
  }
});