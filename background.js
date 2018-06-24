var n = 0;
// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//     ++n;
//     //console.log("onBeforeRequest details[" + n + "]: ", details);
//     chrome.tabs.getSelected(function(tab) { //выбирается ид открытого таба, выполняется коллбек с ним
//         chrome.tabs.sendRequest(tab.id, {details : details, n: n}); //запрос  на сообщение
//     });
// }, {
//     urls : ["<all_urls>"]
// }, ["requestBody"]);
function printObject(obj, groupName) {

  chrome.tabs.executeScript({
    code: 'console.groupCollapsed("' + (groupName ? groupName : 'Details') + '")'
  });

  for (var key in obj) {
    if (key == 'requestBody') {
      printObject(obj[key], key)
    } else if (key == 'formData') {
      printObject(obj[key], key)
    } else {
      chrome.tabs.executeScript({
        code: 'console.log("' + key + ': ' + obj[key] + '")'
      });
    }
  }
  chrome.tabs.executeScript({
    code: 'console.groupEnd()'
  });

}

// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//   ++n;
//
//   console.log('details: ', details);
//   chrome.tabs.executeScript({
//     code: 'console.log("printObject-background.js: ");'
//   });
//   //
//   // chrome.tabs.executeScript({
//   //   code: 'console.groupCollapsed("' + details.method + ' [' + n + '] ' + details.url + '");'
//   // });
//   //
//   // if (details.requestBody && details.requestBody.formData) {
//   //   chrome.tabs.executeScript({
//   //     code: 'console.groupCollapsed("Params")'
//   //   });
//   //
//   //   printObject(details.requestBody.formData, 'formData');
//   //
//   //   chrome.tabs.executeScript({
//   //     code: 'console.groupEnd();'
//   //   });
//   // }
//   //
//   // printObject(details);
//   //
//   // chrome.tabs.executeScript({
//   //   code: 'console.groupEnd()'
//   // });
// }, {
//   urls: ["<all_urls>"]
// }, ["requestBody"]);
//
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function(details) {
//     for (var i = 0; i < details.requestHeaders.length; ++i) {
//       if (details.requestHeaders[i].name === 'User-Agent') {
//         details.requestHeaders.splice(i, 1);
//         break;
//       }
//     }
//     return {requestHeaders: details.requestHeaders};
//   },
//   {urls: ["<all_urls>"]},
//   ["blocking", "requestHeaders"]);

// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//   chrome.tabs.executeScript({
//     code: 'console.log("complited details")'
//   });
//   ///console.log('complited details', details);
// }, {
//   urls: ["<all_urls>"]
// }, ["responseBody"]);

/* The Web Request API */
const WEB_REQUEST = chrome.webRequest;

WEB_REQUEST.onBeforeRequest.addListener(
  function(details) {
    var regExp = /^.*api_v3\/multi_export\/updateStatistic\/(\d+)/i;
    var newDetails = Object.assign(details);
    if (details.method == "POST")
      if (regExp.test(details.url)) {
        console.log('URL_newDetails: ', newDetails);
        console.log('URL: ', details);
        var postedString = decodeURIComponent(String.fromCharCode.apply(null,
          new Uint8Array(details.requestBody.raw[0].bytes)));
        console.log('postedString: ', postedString);
        var statisticID = regExp.exec(details.url)[1];
        console.log('statisticID: ', statisticID);
        console.log('formData: ', details.requestBody.formData);
      }
    //console.log('POST: ', JSON.stringify(details));
    //console.log('POST: ', details);

    //api_v3/multi_export/updateStatistic
    //requestBody.formData
    // events[app_ready]:["6"]
    //type
    //console.log('POST: ', details.url);
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);

// chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
//
//     console.log('onBeforeSendHeaders details: ', details);
//     return {requestHeaders : details.requestHeaders};
// }, {
//     urls : ["<all_urls>"]
// }, ["blocking", "requestHeaders"]);

// chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
//     // for (var i = 0; i < details.requestHeaders.length; ++i) {
//     //     if (details.requestHeaders[i].name === 'User-Agent') {
//     //         details.requestHeaders.splice(i, 1);
//     //         break;
//     //     }
//     // }
//     console.log('onBeforeSendHeaders details: ', details);
//     return {requestHeaders : details.requestHeaders};
// }, {
//     urls : ["<all_urls>"]
// }, ["requestHeaders"]);