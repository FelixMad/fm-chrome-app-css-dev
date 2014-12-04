var patron = new RegExp(/html5rocks/);

chrome.tabs.onUpdated.addListener(function(tabs,changeInfo, tab) {
	if (changeInfo.status == 'loading'){
		changeIcon(tabs);
		loadCSS(tabs)
	}
});

chrome.tabs.onSelectionChanged.addListener(changeIcon);

function loadCSS(tabs){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if(patron.test(tabs[0].url)){
			chrome.tabs.executeScript(null, {file: 'js/content_script.js'},null);
		}
	});
};

function changeIcon(tabs){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var file = "../img/";
		var icon = file + "inactive.png";
		if(patron.test(tabs[0].url)) icon = file + "active.png";
		chrome.browserAction.setIcon({path: icon});
	});	
};