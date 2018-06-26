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

function printObject(obj, groupName) {

  chrome.tabs.executeScript({
    code : 'console.groupCollapsed("' + (groupName ? groupName : 'Details') + '")'
  });

  for (var key in obj) {
    if (key == 'requestBody') {
      printObject(obj[key], key)
    } else if (key == 'formData') {
      printObject(obj[key], key)
    } else {
      chrome.tabs.executeScript({
        code : 'console.log("' + key + ': ' + obj[key] + '")'
      });
    }
  }
  chrome.tabs.executeScript({
    code : 'console.groupEnd()'
  });

}

function getInfoDiv(params) {
  var createDiv = 'var elDiv=document.createElement("div"); elDiv.id="stat_params"; elDiv.style="height: 100px; background-color: #00ff80;"; ';
  var addDiv = createDiv + " document.body.insertBefore(elDiv, document.body.firstChild); ";
  var command = "var div = document.getElementById('stat_params'); if (!div) {" + addDiv + "}";
  command += "var div=document.getElementById('stat_params'); var textnode = document.createTextNode(\"Water\");  div.appendChild(textnode);";
  //"document.body.style.backgroundColor='red'"
  //<div style="height: 100px; background-color: #00ff80;">sssssss</div>
  return command;
}


/* The Web Request API */
const WEB_REQUEST = chrome.webRequest;

WEB_REQUEST.onBeforeRequest.addListener(function(details) {
    var regExp = /^.*api_v3\/multi_export\/updateStatistic\/(\d+)/i;
    if (details.method == "POST") {
      if (regExp.test(details.url)) {
        var statisticID = regExp.exec(details.url)[1];
        console.log('statisticID: ', statisticID);
        if (!statisticParams[statisticID]) {
          statisticParams[statisticID] = {};
        }
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

        var keys = Object.keys(statisticParams);
        for (var i=0; i<keys.length; i++) {
          chrome.tabs.executeScript(
            details.tabId,
            {
              code: "console.log('" + keys[i] + ": " + JSON.stringify(statisticParams[keys[i]]) + "');"
            }
          );

        }
        // console.log(Object.keys(statisticParams));
        // chrome.tabs.executeScript(
        //   details.tabId,
        //   {
        //     code: "console.log('Statistic params: " + JSON.stringify(statisticParams) + "');"
        //   }
        // );
        // chrome.tabs.executeScript(
        //   details.tabId,
        //   {
        //     code: getInfoDiv(statisticParams)
        //   }
        // );
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