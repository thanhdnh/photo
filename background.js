chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request[0]==='toPopupJS'){
		glvars_inputtext = request[2];
	}
});

chrome.runtime.onInstalled.addListener(function (object) {
	if(object.reason==='install')
		chrome.tabs.create({url: "http://www.emojiselector.com/"});
});

var glvars_inputtext = '';