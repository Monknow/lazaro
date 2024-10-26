let securityStatus = "unsafe";

function safetyUpdate() {
	document.body.classList.add(securityStatus);

	const recommendation = document.querySelector(".recommendation");
	const safeRecommendation = "Parece ser <strong>segura</strong>. Puede seguir navegando";
	const unsafeRecommendation =
		"La página es <strong>insegura</strong>. No se preocupe, tome una de las siguientes opciones";
	const unsureRecommendation = "No pudimos determinar la seguridad del sitio. Continue con discreción";

	switch (securityStatus) {
		case "unsafe":
			recommendation.innerHTML = unsafeRecommendation;
			break;
		case "safe":
			recommendation.innerHTML = safeRecommendation;
			break;
		case "unsure":
			recommendation.innerHTML = unsureRecommendation;
			break;
	}
}

safetyUpdate();

// Function to update the current page's URL in the HTML element with class "current-page"
function updateCurrentPage(url) {
	const currentPageElement = document.querySelector(".current-page");
	if (currentPageElement) {
		const origin = new URL(url).origin;

		currentPageElement.textContent = `${origin}`;
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
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	if (tabs.length > 0) {
		updateCurrentPage(tabs[0].url);
	}
});
