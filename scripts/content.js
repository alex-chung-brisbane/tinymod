// Dynamically import as this file isn't loaded as a module
(async () => {
    // Imports, make sure to allow acess to these in the manifest
    const Helpers = await import(chrome.runtime.getURL('/modules/helpers.js'));

    // Listen for messages from context menu clicks
    chrome.runtime.onMessage.addListener((contextMenuItemId) => {
        // TODO: Update
        // Run code depending on context menu item ID
        switch (contextMenuItemId) {
            case 'demo_one':
                console.log('Demo 1 clicked!');
                break;
            case 'demo_two':
                console.log('Demo 2 clicked!');
                break;
        }
    });

    // Listen for messages from button clicks
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // TODO: Update
        // Run code depending on button ID
        switch (request.action) {
            case 'action-button':
                console.log('Action button clicked!');
                break;
        }
    });

    // Default values for settings in popup
    const defaults = {
        'saved-setting': false
    }

    // Watch for changes in storage (i.e. when option is toggled and new value is written to local storage)
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            let dataInsert = {};
            dataInsert[key] = newValue;
            RefreshOptionStates(dataInsert);
        }
    });

    // Triggers required function calls depending on if each option is toggled
    function RefreshOptionStates(customOptions = defaults) {
        chrome.storage.local.get(Object.keys(customOptions)).then((settings) => {
            Object.keys(customOptions).forEach((key) => {
                // Skip iteration if unrecognized setting
                if (!defaults.hasOwnProperty(key)) return;

                let value = settings[key];

                // Set to default value if non already exists
                if (value == null) {
                    let dataInsert = {};
                    value = customOptions[key];
                    dataInsert[key] = value;
                    chrome.storage.local.set(dataInsert);
                }

                // Object that holds each setting, it's styles and actions for toggle on/off
                const actions = {
                    // TODO: Update
                    'saved-setting': {
                        stylesheet: `
                    
                    `,
                        enable: () => {
                            console.log('[Enable] saved-setting');
                        },
                        disable: () => {
                            console.log('[Disable] saved-setting');
                        }
                    }
                }

                if (value) {
                    // Toggle on
                    let modStylesheet = document.createElement('style');
                    modStylesheet.id = key;
                    modStylesheet.innerHTML = actions[key].stylesheet;
                    document.head.append(modStylesheet);

                    actions[key].enable();
                } else {
                    // Toggle off
                    let modStylesheet = document.querySelector(`#${key}`);
                    if (modStylesheet != null) {
                        modStylesheet.remove();
                    }

                    actions[key].disable();
                }
            });
        });
    }

    // Manually trigger once on script run
    RefreshOptionStates();

    // TODO: Update
    Helpers.Demo();
})();