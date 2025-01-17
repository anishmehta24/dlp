document.getElementById("save").addEventListener("click", () => {
    const fileTypes = document.getElementById("fileTypes").value
      .split(",")
      .map((type) => type.trim());
    chrome.storage.sync.set({ blockedFileTypes: fileTypes }, () => {
      alert("Settings saved!");
    });
  });
  
  // Load existing settings
  chrome.storage.sync.get("blockedFileTypes", (data) => {
    if (data.blockedFileTypes) {
      document.getElementById("fileTypes").value = data.blockedFileTypes.join(", ");
    }
  });
  