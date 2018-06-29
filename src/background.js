
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
	notifyUser();
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
* Notifies User to reload existing pages on install
**/
function notifyUser(){
	var notificationId = "xpath-seeker-notify";
	var notificationTitle = "XPath Seeker Notification Alert!";
	var message = "Existing pages need to be reloaded for extension to work on these pages";
	var options = {
		type: "basic",
		title: notificationTitle,
		message: message,
		iconUrl: 'images/icon48.png',
		priority: 2,
		requireInteraction: true
	}
		
	// check if the browser supports notifications
	if (window.Notification) {
		// Get notification permission
		chrome.notifications.getPermissionLevel(function (permission) {
			if (permission === "granted") {
				chrome.notifications.create(notificationId, options);
			}
			else {
				alert(message);
			}
		});
	}
	else {
		alert(message);
	}
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
