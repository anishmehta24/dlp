import React, { useState } from "react";
import "./App.css";

const App = () => {
  const predefinedExtensions = [".txt", ".jpg", ".png", ".pdf", ".docx"];
  const [extensions, setExtensions] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  // Add a new extension (either from the dropdown or custom input)
  const handleAddExtension = () => {
    let newExtension = selectedOption || customInput.trim();
    if (newExtension && !extensions.includes(newExtension)) {
      const updatedExtensions = [...extensions, newExtension];
      console.log(updatedExtensions)
      setExtensions(updatedExtensions);
      sendMessageToBackground(updatedExtensions);
      sendMessageToContent(updatedExtensions);
      setCustomInput("");
      setSelectedOption("");
    }
  };

  // Remove an extension
  const handleRemoveExtension = (ext) => {
    const updatedExtensions = extensions.filter((e) => e !== ext);
    setExtensions(updatedExtensions);
    sendMessageToBackground(updatedExtensions);
    sendMessageToContent(updatedExtensions);
  };

  // Send a message to background.js
  const sendMessageToBackground = (data) => {
    chrome.runtime.sendMessage({ type: "UPDATE_EXTENSIONS", data });
  };

  // Send a message to content.js
  const sendMessageToContent = (data) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "UPDATE_EXTENSIONS", data });
      }
    });
  };

  return (
    <div className="app">
      <h1>Manage Extensions</h1>
      <div className="input-container">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select an extension</option>
          {predefinedExtensions.map((ext, index) => (
            <option key={index} value={ext}>
              {ext}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Custom extension (e.g., .csv)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
        />
        <button onClick={handleAddExtension}>Add</button>
      </div>
      <ul className="extensions-list">
        {extensions.map((ext, index) => (
          <li key={index} className="extension-item">
            {ext}
            <button onClick={() => handleRemoveExtension(ext)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
