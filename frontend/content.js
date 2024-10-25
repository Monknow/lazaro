async function setDangerous() {
	await chrome.runtime.sendMessage({greeting: "body", bodyString: document.documentElement.outerHTML});
	const analysis = await chrome.runtime.sendMessage({greeting: "analysis"});

	if (analysis !== "safe") {
		const warning = document.createElement("h1");

		warning.innerHTML = "Este es un sitio sospechoso. Le recomendamos cerrar el sitio";
		warning.style = `
        position: fixed; 
        z-index: 99999;
        top: 0px; 
        left: 0px; 
        width: 100vw; 
        padding: 20px;
        text-align: center;
        background-color: red; 
        color: white;
        font-size: 16px;
        font-weight: 600;
        font-family: sans-serif;
        `;

		document.body.appendChild(warning);
	}
}

function getPageContent() {
	chrome.runtime.sendMessage({action: "takeScreenshot"}, (response) => {
		if (response && response.screenshot) {
			const img = document.createElement("img");
			img.src = response.screenshot;
			img.style.position = "fixed";
			img.style.top = "10px";
			img.style.left = "10px";
			img.style.border = "2px solid #000";
			img.style.zIndex = 10000;
			img.style.width = "200px";
			img.style.height = "auto";
			document.body.appendChild(img);
		}
	});
}

setInterval(getPageContent, 5 * 1000);

// setDangerous();
