function setDangerous(reason) {
	const warning = document.createElement("h1");

	warning.innerHTML = reason;
	warning.style = `
	position: fixed; 
	z-index: 99999;
	top: 0px; 
	left: 0px; 
	width: 100vw; 
	padding: 40px;
	text-align: center;
	background: linear-gradient(70deg, #e84e46 0%, #e87d77 100%); 
	color: white;
	font-size: 16px;
	font-weight: 600;
	font-family: sans-serif;
	`;

	document.body.appendChild(warning);
	
}


function waitGetPage() {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({action: "takeScreenshot"}, (response) => {
			if (response && response.screenshot) {
				resolve(response.screenshot);
			}
		});
	});
}

async function getPageContent() {
	const dataurl = await waitGetPage();

/* 	const img = document.createElement("img");
	img.src = dataurl;
	img.style.position = "fixed";
	img.style.top = "10px";
	img.style.left = "10px";
	img.style.border = "2px solid #000";
	img.style.zIndex = 10000;
	img.style.width = "200px";
	img.style.height = "auto";
	document.body.appendChild(img); */

	return dataurl;
}



async function sendToServer(dataurl) {
	chrome.runtime.sendMessage({type: "upload-image", dataurl: dataurl}, (response) => {
		chrome.runtime.sendMessage({ type: "analysis", result: response.result });

		if (response.result.securityStatus === "unsafe") {
			setDangerous(response.result.reason)
		} 

		console.log(response.result)
	});
}

async function main() {
	const dataurl = await getPageContent();
	await sendToServer(dataurl);
}

// Gives time to page to load
setTimeout(main, 1000);

// Run on back/forward navigation
window.addEventListener('popstate', main);

