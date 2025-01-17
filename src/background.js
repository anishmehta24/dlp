const blockedExtensions = [".pdf", ".docx", ".xls"]; // Blocked file types
const approvedWebsites = ["https://example.com"]; // Approved domains

// Intercept downloads
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
