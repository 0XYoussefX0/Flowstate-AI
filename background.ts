let activeTabId: number;

// got a little help with the syntax from gemini
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});

const sendMessage = async (tabId: number, urlParameters: URLSearchParams) => {
  console.log(activeTabId, tabId);
  if (activeTabId === tabId) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: "new video",
        videoId: urlParameters.get("v"),
      });
    } catch (e) {
      setTimeout(() => {
        sendMessage(tabId, urlParameters);
      }, 200);
    }
  } else {
    setTimeout(() => {
      sendMessage(tabId, urlParameters);
    }, 200);
  }
};

// this code is copied from a tutorial on freecodecamp and i'm modified it
chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    sendMessage(tabId, urlParameters);
  } else if (tab.url && tab.url.includes("youtube.com/shorts")) {
    const state = await chrome.storage.local.get("switchState");
    if (state.switchState === true) {
      try {
        await chrome.tabs.goBack(tabId);
      } catch (e) {
        // i used chatgpt for the next line to find a method that will help me push the user to the home page if they have remove shorts switch turned on
        chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
      }
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
