function safetyUpdate(result) {
	document.body.className = "";
	document.body.classList.add(result.securityStatus);


	const recommendation = document.querySelector(".recommendation");
	recommendation.innerHTML = result.reason;
}

// Function to update the current page's URL in the HTML element with class "current-page"
function updateCurrentPage(url) {
	const currentPageElement = document.querySelector(".current-page");
	if (currentPageElement) {
		const origin = new URL(url).origin;

		currentPageElement.textContent = `${origin}`;
		safetyUpdate({ securityStatus: "loading", reason: "Nos encontramos verificando la seguridad de la pagina" })
	}
}

// Function to handle tab changes
function handleTabChange(tabId) {
	// Get the active tab's URL
	chrome.tabs.get(tabId, function (tab) {
		if (tab && tab.url) {
			updateCurrentPage(tab.url);
		}
	});
}

// Event listener for active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
	handleTabChange(activeInfo.tabId);
});

// Event listener for tab URL updates (e.g., navigation within the same tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.active && changeInfo.url) {
		updateCurrentPage(changeInfo.url);
	}
});

// Initial call to update the page URL when the popup opens
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	if (tabs.length > 0) {
		updateCurrentPage(tabs[0].url);
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === 'analysis') {
		safetyUpdate(request.result, sender.origin);
	}
});

