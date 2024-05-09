// this code was part of the code that i've copied from a tutorial on freecodecamp
chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "new video",
      videoId: urlParameters.get("v"),
    });
  } else if (tab.url && tab.url.includes("youtube.com/shorts")) {
    const state = await chrome.storage.local.get("switchState");
    console.log(state);
    if (state.switchState === true) {
      chrome.tabs.goBack(tabId);
    }
  }
});

//copied this code from stack overflow to ensure that the content script reruns everytime the url updates
chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.frameId === 0) {
    // Fires only when details.url === currentTab.url
    chrome.tabs.get(details.tabId, function (tab) {
      if (tab.url === details.url && tab.url.includes("youtube.com")) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: "url changed",
          });
        }
      }
    });
  }
});
