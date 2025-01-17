const blockedExtensions = [".pdf", ".docx", ".xls"]; // List of blocked extensions
const allowedWebsites = ["*://*/*"]; // List of approved websites

const currentURL = window.location.href;

// Check if the current website is in the allowed websites list
const isAllowedWebsite = allowedWebsites.some((site) => currentURL.includes(site));

// Block download links if the website is not allowed and the extension is blocked
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
