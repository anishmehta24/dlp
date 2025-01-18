import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const predefinedExtensions = [".txt", ".jpg", ".png", ".pdf", ".docx"];
  const [uploadExtensions, setUploadExtensions] = useState([]);
  const [downloadExtensions, setDownloadExtensions] = useState([]);
  const [blockedWebsites, setBlockedWebsites] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("upload");

  useEffect(() => {
    chrome.storage.local.get(
      ["uploadExtensions", "downloadExtensions", "blockedWebsites"],
      (result) => {
        setUploadExtensions(result.uploadExtensions || []);
        setDownloadExtensions(result.downloadExtensions || []);
        setBlockedWebsites(result.blockedWebsites || []);
      }
    );
  }, []);

  const saveToStorage = (updatedData) => {
    chrome.storage.local.set(updatedData);
  };

  const handleAddExtension = () => {
    let newExtension = selectedOption || customInput.trim();
    if (newExtension) {
      if (selectedColumn === "upload" && !uploadExtensions.includes(newExtension)) {
        const updatedExtensions = [...uploadExtensions, newExtension];
        setUploadExtensions(updatedExtensions);
        saveToStorage({
          uploadExtensions: updatedExtensions,
          downloadExtensions,
          blockedWebsites,
        });
        sendMessage({ upload: updatedExtensions, download: downloadExtensions, websites: blockedWebsites });
      }
      if (selectedColumn === "download" && !downloadExtensions.includes(newExtension)) {
        const updatedExtensions = [...downloadExtensions, newExtension];
        setDownloadExtensions(updatedExtensions);
        saveToStorage({
          uploadExtensions,
          downloadExtensions: updatedExtensions,
          blockedWebsites,
        });
        sendMessage({ upload: uploadExtensions, download: updatedExtensions, websites: blockedWebsites });
      }
      setCustomInput("");
      setSelectedOption("");
    }
  };

  const handleAddWebsite = () => {
    const website = websiteInput.trim();
    if (website && !blockedWebsites.includes(website)) {
      const updatedWebsites = [...blockedWebsites, website];
      setBlockedWebsites(updatedWebsites);
      saveToStorage({
        uploadExtensions,
        downloadExtensions,
        blockedWebsites: updatedWebsites,
      });
      sendMessage({ upload: uploadExtensions, download: downloadExtensions, websites: updatedWebsites });
      setWebsiteInput("");
    }
  };

  const handleRemove = (item, type) => {
    if (type === "upload") {
      const updatedExtensions = uploadExtensions.filter((e) => e !== item);
      setUploadExtensions(updatedExtensions);
      saveToStorage({
        uploadExtensions: updatedExtensions,
        downloadExtensions,
        blockedWebsites,
      });
      sendMessage({ upload: updatedExtensions, download: downloadExtensions, websites: blockedWebsites });
    } else if (type === "download") {
      const updatedExtensions = downloadExtensions.filter((e) => e !== item);
      setDownloadExtensions(updatedExtensions);
      saveToStorage({
        uploadExtensions,
        downloadExtensions: updatedExtensions,
        blockedWebsites,
      });
      sendMessage({ upload: uploadExtensions, download: updatedExtensions, websites: blockedWebsites });
    } else if (type === "website") {
      const updatedWebsites = blockedWebsites.filter((w) => w !== item);
      setBlockedWebsites(updatedWebsites);
      saveToStorage({
        uploadExtensions,
        downloadExtensions,
        blockedWebsites: updatedWebsites,
      });
      sendMessage({ upload: uploadExtensions, download: downloadExtensions, websites: updatedWebsites });
    }
  };

  const sendMessage = (data) => {
    chrome.runtime.sendMessage({ type: "UPDATE_BLOCKLIST", data });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "UPDATE_BLOCKLIST", data });
      }
    });
  };

  return (
    <div className="app">
      <h1>Manage Blocklist</h1>
      <div className="input-container">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="dropdown"
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
          className="custom-input"
        />
        <button onClick={handleAddExtension} className="add-button full-width">
          Add Extension
        </button>
      </div>
      <div className="radio-buttons">
          <label>
            <input
              type="radio"
              name="column"
              value="upload"
              checked={selectedColumn === "upload"}
              onChange={(e) => setSelectedColumn(e.target.value)}
            />
            Block Upload
          </label>
          <label>
            <input
              type="radio"
              name="column"
              value="download"
              checked={selectedColumn === "download"}
              onChange={(e) => setSelectedColumn(e.target.value)}
            />
            Block Download
          </label>
        </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Block a website (e.g., example.com)"
          value={websiteInput}
          onChange={(e) => setWebsiteInput(e.target.value)}
          className="website-input"
        />
        <button onClick={handleAddWebsite} className="add-button full-width">
          Add Website
        </button>
      </div>
      <div className="columns-container">
        <div className="column">
          <h2>Blocked Extensions</h2>
          <div className="block-section">
            <h3>Upload</h3>
            <ul className="extensions-list">
              {uploadExtensions.map((ext, index) => (
                <li key={index} className="extension-item">
                  {ext}
                  <button
                    onClick={() => handleRemove(ext, "upload")}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <h3>Download</h3>
            <ul className="extensions-list">
              {downloadExtensions.map((ext, index) => (
                <li key={index} className="extension-item">
                  {ext}
                  <button
                    onClick={() => handleRemove(ext, "download")}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="column">
          <h2>Blocked Websites</h2>
          <ul className="extensions-list">
            {blockedWebsites.map((site, index) => (
              <li key={index} className="extension-item">
                {site}
                <button
                  onClick={() => handleRemove(site, "website")}
                  className="remove-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
