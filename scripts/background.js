// Create an event listener for context menu action clicked
chrome.contextMenus.onClicked.addListener(ContextMenuClicked);

/**
 * Handle callback from context menu action
 * @param {object} info 
 */
async function ContextMenuClicked(info) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, info.menuItemId);
}

// Register context menu items on extension install
chrome.runtime.onInstalled.addListener(() => {
    // TODO: Update
    // Context items to create
    const CONTEXT_ITEMS = {
        'demo_one': {
            title: 'Demo 1'
        },
        'demo_two': {
            title: 'Demo 2'
        }
    }

    // Iterate through context items and register each one
    for (let contextId in CONTEXT_ITEMS) {
        let props = {
            id: contextId,
            title: CONTEXT_ITEMS[contextId].title
        }

        // Optional parameters in CONTEXT_ITEMS
        if (CONTEXT_ITEMS[contextId].type) props['type'] = CONTEXT_ITEMS[contextId].type;
        if (CONTEXT_ITEMS[contextId].parent) props['parent'] = CONTEXT_ITEMS[contextId].parent;

        chrome.contextMenus.create(props);
    }
});