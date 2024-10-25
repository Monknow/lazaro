chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "takeScreenshot") {
		chrome.tabs.captureVisibleTab(sender.tab.windowId, {format: "png"}, (dataUrl) => {
			sendResponse({screenshot: dataUrl});
		});
		return true; // Keep the message channel open for async response
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.greeting == "body") {
		const tempContainer = chrome.createElement("div");
		tempContainer.innerHTML = message.bodyString;
		const element = tempContainer.firstChild;

		console.log(element);
	}

	if (message.greeting === "analysis") {
		sendResponse("safe");

		return true;
	}
});
