let blockedExtensions = [".pdf", ".docx", ".xls",".jpg",".png",".jpeg"]; 
const allowedWebsites = ["*://*/*"];

const currentURL = window.location.href;


const isAllowedWebsite = allowedWebsites.some((site) => currentURL.includes(site));


if (!isAllowedWebsite) {
  const links = document.querySelectorAll('a[href]'); // Find all links
  links.forEach(link => {
    const fileExtension = link.href.split(".").pop();
    
    if (blockedExtensions.includes(`.${fileExtension}`)) {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the download
        showCustomAlert(`Downloading files with the extension .${fileExtension} is blocked on this website.`);
      });
    }
  });
}

const alertContainer = document.createElement('div');
alertContainer.id = 'custom-alert';
alertContainer.style.position = 'fixed';
alertContainer.style.top = '20px';
alertContainer.style.left = '50%';
alertContainer.style.transform = 'translateX(-50%)';
alertContainer.style.backgroundColor = '#ff4d4d';
alertContainer.style.color = '#fff';
alertContainer.style.padding = '10px 20px';
alertContainer.style.borderRadius = '5px';
alertContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
alertContainer.style.fontSize = '14px';
alertContainer.style.zIndex = '1000';
alertContainer.style.display = 'none';
document.body.appendChild(alertContainer);

// Show the custom alert message
function showCustomAlert(message) {
  alertContainer.textContent = message;
  alertContainer.style.display = 'block';

  // Automatically hide the alert after 3 seconds
  setTimeout(() => {
    alertContainer.style.display = 'none';
  }, 3000);
}


function blockFileUpload() {

  document.addEventListener(
    "change",
    function (event) {
      if (event.target.type === "file") {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
          const fileName = files[i].name.toLowerCase();
          const fileExtension = fileName.substring(fileName.lastIndexOf("."));

          if (blockedExtensions.includes(fileExtension)) {

        
            event.target.value = "";

            // Show modal to the user
            showCustomAlert(
              `WARNING! Upload blocked: ${fileExtension} files are not allowed.` 
            );

            // Stop the event until the user makes a choice
            event.preventDefault()
            event.stopPropagation()
            break;
          }
        }
      }
    },
    true
  );
}

  // Block drag and drop uploads
  // document.addEventListener('dragover', function(event) {
  //   event.preventDefault();
  // }, true);

  // document.addEventListener('drop', function(event) {
  //   const items = event.dataTransfer?.items;
    
  //   if (items) {
  //     for (let i = 0; i < items.length; i++) {
  //       if (items[i].kind === 'file') {
  //         const file = items[i].getAsFile();
  //         const fileName = file.name.toLowerCase();
  //         const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
          
  //         if (blockedExtensions.includes(fileExtension)) {
  //           event.preventDefault();
  //           event.stopPropagation();
  //           alert(`Upload blocked: ${fileExtension} files are not allowed.`);
  //           break;
  //         }
  //       }
  //     }:
  //   }
  // }, true);


// Initialize as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', blockFileUpload);
} else {
  blockFileUpload();
}




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_EXTENSIONS") {
    blockedExtensions = message.data; // Update the local extensions list
    console.log("Updated extensions in content.js:", blockedExtensions);

    // Perform any custom logic using the updated extensions
    // For example, filter links or files on the page
    handleUpdatedExtensions(blockedExtensions);

    sendResponse({ success: true });
  }
});

function handleUpdatedExtensions(extensions) {
  // Example: Highlight links on the page matching the extensions
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && extensions.some((ext) => href.endsWith(ext))) {
      link.style.backgroundColor = "yellow"; // Highlight matching links
    }
  });
}