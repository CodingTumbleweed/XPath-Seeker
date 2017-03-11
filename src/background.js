
var XpathmenuItemId = "xpathmenuitem-1";
var isExtActive = true;

/**
 * Adds event listener for menu click
 */
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === XpathmenuItemId) {
        if (tab){
            chrome.tabs.sendMessage(tab.id, { getXPath: true}, function (response) {
                if (response) {
                    window.prompt('Xpath for selected element (Use "Ctrl/Cmd + C" to Copy):', response.xpath);
                }
		});
		}
    }
});

/**
 * Creating a context menu item on extension installation
 */
chrome.runtime.onInstalled.addListener(function() {
    createMenuItem(XpathmenuItemId, "Get XPath");
});


/**
* Remove XPath Menu Item from context Menu
**/
function removeMenuItem(itemId) {
    chrome.contextMenus.remove(itemId);
}

function createMenuItem(itemId, title) {
    chrome.contextMenus.create({
        "title": title,
        "id": itemId,
        "type": "normal",
        "contexts": ["all"]
    });
}

/**
* Adds/Removes Xpath Menu item when user clicks extension icon
**/
chrome.browserAction.onClicked.addListener(function (tab) {
    if (!!isExtActive) {
        removeMenuItem(XpathmenuItemId);
        chrome.browserAction.setIcon({ path: 'images/icon16-grey.png', tabId: tab.id });
    } else {
        createMenuItem(XpathmenuItemId, "Get XPath");
        chrome.browserAction.setIcon({ path: 'images/icon16.png', tabId: tab.id });
    }
    isExtActive = !isExtActive;
});