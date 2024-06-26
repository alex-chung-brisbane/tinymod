// Startup procedure for popup elements (checkboxes)
Array.from(document.querySelectorAll('input[type="checkbox"].persistent-checkbox')).forEach((el) => {
    // Trigger update to saved preferences when user changes checkbox value
    el.oninput = UpdatePreferences;

    // Load existing preferences, update UI to match
    chrome.storage.local.get([el.id]).then(settings => {
        if (settings[el.id]) el.checked = true;
    });
});

/**
 * Set local storage values to match UI (user's setting)
 */
function UpdatePreferences() {
    Array.from(document.querySelectorAll('input[type="checkbox"].persistent-checkbox')).forEach((el) => {
        let dataInsert = {};
        dataInsert[el.id] = el.checked;
        chrome.storage.local.set(dataInsert);
    });
}

// Startup procedure for popup elements (buttons)
Array.from(document.querySelectorAll('button.remote-button')).forEach((el) => {
    // Register a handler to send message to content script onclick
    el.onclick = () => {
        (async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            await chrome.tabs.sendMessage(tab.id, { action: el.id });
        })();
    }
});