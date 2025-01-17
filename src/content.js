const blockedExtensions = [".pdf", ".docx", ".xls"]; 
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
        alert(`Downloading files with the extension .${fileExtension} is blocked on this website.`);
      });
    }
  });
}


async function isCurrentSiteBlocked() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'CHECK_URL' }, response => {
      resolve(response.isBlocked);
    });
  });
}

async function initializeBlocker() {
  // Only proceed if the current site is blocked
  const isBlocked = await isCurrentSiteBlocked();
  if (!isBlocked) return;

  // Block file uploads
  document.addEventListener('change', function(event) {
    if (event.target.type === 'file') {
      const files = event.target.files;
      
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i].name.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        
        if (blockedExtensions.includes(fileExtension)) {
          event.target.value = '';
          alert(`Upload blocked: ${fileExtension} files are not allowed on this website.`);
          event.preventDefault();
          event.stopPropagation();
          break;
        }
      }
    }
  }, true);

  // Block drag and drop
  document.addEventListener('dragover', function(event) {
    event.preventDefault();
  }, true);

  document.addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    alert('File uploads are not allowed on this website.');
  }, true);

  // Disable all file inputs
  const disableFileInputs = () => {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.disabled = true;
      input.style.opacity = '0.5';
      
      // Add a tooltip
      input.title = 'File uploads are not allowed on this website';
      
      // Add a visual indicator next to the input
      const warning = document.createElement('span');
      warning.textContent = '⚠️ Uploads disabled';
      warning.style.marginLeft = '10px';
      warning.style.color = 'red';
      input.parentNode.insertBefore(warning, input.nextSibling);
    });
  };

  // Run immediately and observe DOM changes
  disableFileInputs();
  new MutationObserver(disableFileInputs).observe(document.body, {
    childList: true,
    subtree: true
  });
}



// Initialize as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBlocker);
} else {
  initializeBlocker();
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_EXTENSIONS") {
    console.log("Received extensions in content.js:", message.data);
    // Handle the extensions in the content script
  }
});