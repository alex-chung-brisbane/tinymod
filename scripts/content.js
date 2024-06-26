// Mod menu element
let modMenu = {
    el: null,
    editor: null
};

// Create a MutationObserver to toggle mod menu if a tinymce editor is detected on the page
const tinymcePresenceObserver = new MutationObserver(() => {
    if (isActiveEditorInitialized()) {
        createModMenu(tinymce.activeEditor);
        return;
    }

    removeModMenu();
});
tinymcePresenceObserver.observe(document.body, {
    subtree: true,
    childList: true
});

/**
 * Creates the mod menu element if it exists
 * @param {tinymce.Editor} editor the tinymce editor to attach mods to
 * @returns null
 */
function createModMenu(editor) {
    if (modMenu.el != null && modMenu.editor === editor) return;
    if (modMenu.el != null) removeModMenu();

    modMenu.editor = editor;

    modMenu.el = document.createElement('div');
    setStyle(modMenu.el, `z-index: 9999; position: absolute; right: 0; bottom: 10%; margin: 4px;`);

    let btnShowMenu = document.createElement('button');
    btnShowMenu.innerText = 'Mods';
    setStyle(btnShowMenu, `cursor: pointer; padding: 4px 6px; border-radius: 4px; button-style: normal; background: #eee; color: #000;`);
    btnShowMenu.onclick = (ev) => {
        ev.preventDefault();

        // Dynamically generate available element list based on parent tree
        let parentElements = [];
        let targetNode = editor.selection.getNode();
        let levelCounter = 0;
        do {
            parentElements.push({
                text: `Level ${levelCounter} | <${targetNode.tagName.toLowerCase()}>`,
                value: `insertBlank_${levelCounter}`,
                el: targetNode
            });
            levelCounter++;
            targetNode = targetNode.parentElement;
        } while (targetNode != editor.getBody());

        let modSelectorDialog = tinymce.activeEditor.windowManager.open({
            title: 'TinyMOD Tools',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'listbox',
                        name: 'selectedMod',
                        label: 'Select a mod',
                        items: [
                            { text: '', value: 'none' },
                            {
                                text: 'Insert blank line after element',
                                items: parentElements
                            }
                        ]
                    }
                ]
            },
            buttons: [
                {
                    type: 'cancel',
                    name: 'doneBtn',
                    text: 'Done',
                    primary: true
                }
            ],
            onChange: (api) => {
                const selectedMod = api.getData()['selectedMod'];

                switch (selectedMod) {
                    case 'none':
                        return;
                    case 'insertBlank':
                        insertBlank(editor, 0);
                        break;
                    default:
                        break;
                }

                // Special case for dynamically-generated element list
                if (selectedMod.split('_')[0] == 'insertBlank') {
                    parentElements.forEach((parentNode) => {
                        if (parentNode.value == selectedMod) insertBlank(editor, parentNode.el);
                    });
                }
                
                modSelectorDialog.close();
            }
        });
    }

    modMenu.el.appendChild(btnShowMenu);
    editor.container.appendChild(modMenu.el);
}

/**
 * Removes the mod menu element if it exists
 * @returns null
 */
function removeModMenu() {
    if (modMenu.el == null) return;

    modMenu.el.remove();
    modMenu.el = null;
    modMenu.editor = null;
}

/**
 * Check whether tinymce's activeEditor is set
 * @returns bool | true if activeEditor ready, otherwise false
 */
function isActiveEditorInitialized() {
    if (tinymce == undefined) return false;
    if (tinymce.activeEditor == null) return false;

    return true;
}

/**
 * Applies an inline style to a DOM element
 * @param {Element} el DOM element to set the inline style attribute of
 * @param {string} inlineStyle inline style attribute to set
 */
function setStyle(el, inlineStyle) {
    el.setAttribute('style', inlineStyle);
}

// ===[ MODS ]===

function insertBlank(editor, targetNode) {
    editor.undoManager.add();

    editor.dom.insertAfter(document.createElement('p'), targetNode);

    editor.execCommand('mceCleanup');
}