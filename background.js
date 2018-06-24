var statisticParams = {};

function parsePostedString(string) {
  var result = {};
  var arrayParams = string.split('&');
  for (var i = 0; i < arrayParams.length; i++) {
    var tmp = arrayParams[i].split('=');
    result[tmp[0]] = tmp[1];
  }
  return result;
}


/* The Web Request API */
const WEB_REQUEST = chrome.webRequest;

WEB_REQUEST.onBeforeRequest.addListener(function(details) {
    var regExp = /^.*api_v3\/multi_export\/updateStatistic\/(\d+)/i;
    if (details.method == "POST") {
      if (regExp.test(details.url)) {
        var statisticID = regExp.exec(details.url)[1];
        statisticParams[statisticID] = {};
        console.log('statisticID: ', statisticID);
        if (Array.isArray(details.requestBody.raw)) {
          var postedString = decodeURIComponent(
            String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes))
          );
          console.log('postedString: ', parsePostedString(postedString));
          Object.assign(
            statisticParams[statisticID],
            parsePostedString(postedString)
          );
        }
        //console.log('URL_newDetails: ', newDetails);
        // console.log('URL: ', details);
        //globalParams[statisticID] = [globalParams[statisticID],...details.requestBody.formData]
        if (details.requestBody.formData) {
          console.log('formData: ', details.requestBody.formData);
          Object.assign(
            statisticParams[statisticID],
            details.requestBody.formData
          );
        }
        console.log(statisticParams);
        var str = "console.log('Statistic params: " + JSON.stringify(statisticParams) + "');";
        console.log(str);
        chrome.tabs.executeScript(
          details.tabId,
          {
            code: "console.log('Statistic params: " + JSON.stringify(statisticParams) + "');"
          }
        );
      }
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