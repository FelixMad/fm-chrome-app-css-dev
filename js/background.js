function refreshLink(tabs){
	var file = "../img/";
	var icon = file + "inactive.png";

	var patron = new RegExp(/http:\/\/localhost:8888/);
	if(patron.test(tabs[0].url)){
		var icon = file + "active.png";
		chrome.tabs.executeScript(null, {file: 'js/content_script.js'},null);
	}
	chrome.browserAction.setIcon({path: icon });
};
/*
chrome.tabs.onUpdated.addListener(function(tabs,changeInfo, tab) {
	if (changeInfo.status == 'loading') getLink(tabs);
});
*/

chrome.tabs.onSelectionChanged.addListener(getLink);

function getLink(tabs){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		refreshLink(tabs);
	});	
	return
}