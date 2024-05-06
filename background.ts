// this code was part of the code that i've copied from a tutorial on freecodecamp
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  console.log("oga bonga");
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});
