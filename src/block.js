URL_TEMPLATES = ["*://*.imgur.com/*"];

chrome.webRequest.onBeforeRequest.addListener(function(d){return {cancel:true};},{urls:URL_TEMPLATES, types:["image"]}, ["blocking"]);
