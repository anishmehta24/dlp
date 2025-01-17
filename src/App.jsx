import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [extensions, setExtensions] = useState([]);
  const [input, setInput] = useState("");

  // Add a new extension
  const handleAddExtension = () => {
    if (input && !extensions.includes(input)) {
      const newExtensions = [...extensions, input];
      setExtensions(newExtensions);
      sendMessageToBackground(newExtensions);
      sendMessageToContent(newExtensions);
      setInput("");
    }
  };

  // Remove an extension
  const handleRemoveExtension = (ext) => {
    const newExtensions = extensions.filter((e) => e !== ext);
    setExtensions(newExtensions);
    sendMessageToBackground(newExtensions);
    sendMessageToContent(newExtensions);
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
      <h1>Manage File Extensions</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter file extension (e.g., .txt)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
