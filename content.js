document.onclick = function(){
	sendInputContent2Extension();
}

document.onkeyup = function(){
	sendInputContent2Extension();
}

function sendInputContent2Extension(){
	var isfb = (window.location.hostname.indexOf('www.facebook.com')>=0);
	var istwitter = (window.location.hostname.indexOf('twitter.com')>=0);
	//try{
	if(String(document.activeElement.getAttribute('type')).toLowerCase()!=='password'){
		if(document.activeElement.getAttribute('contenteditable')){
			if(isfb){
				chrome.runtime.sendMessage(['toPopupJS', 'get', document.activeElement.firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML]);
			}else if(istwitter){
				var s = '';
				var nodes = document.activeElement.firstChild.childNodes;
				for(var i=0; i<nodes.length; i++){
					if(String(nodes[i].tagName).toLowerCase()==='span')
						s = s+nodes[i].getAttribute('data-pictograph-text');
					else
						s = s+(nodes[i].textContent?nodes[i].textContent:nodes[i].innerText);
				}
				chrome.runtime.sendMessage(['toPopupJS', 'get', s]);
			}else{
				chrome.runtime.sendMessage(['toPopupJS', 'get', document.activeElement.innerHTML]);
			}
		}else if(String(document.activeElement.tagName).toLowerCase()==='input' || String(document.activeElement.tagName).toLowerCase()==='textarea'){
			chrome.runtime.sendMessage(['toPopupJS', 'get', document.activeElement.value]);
		}else{
			chrome.runtime.sendMessage(['toPopupJS', 'get', '']);
		}
	}
	//}catch(e){}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request[0]==='toContentJS'){
		var isfb = (window.location.hostname.indexOf('www.facebook.com')>=0);
		if(document.activeElement.getAttribute('contenteditable')){
			if(!isfb)
				document.activeElement.innerHTML = request[2];
			else
				document.activeElement.firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML = request[2];
		}else if(String(document.activeElement.tagName).toLowerCase()==='input' || String(document.activeElement.tagName).toLowerCase()==='textarea'){
			document.activeElement.value = request[2];
		}
	}
});