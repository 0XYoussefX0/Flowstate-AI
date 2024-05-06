(async () => {
  let observer: MutationObserver;
  const removeShorts = () => {
    // this code is for listening for dom changes that occur in the body, it was copied from an article i found online and i made some changes to it
    const targetNode = document.querySelector("body");

    if (!targetNode) return;
    const config = { childList: true, subtree: true };

    const callback = function (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes) {
          const shortsSections = document.querySelectorAll(
            "ytd-rich-section-renderer"
          );
          shortsSections.forEach((shortSection) => {
            shortSection.remove();
          });
        }
      }
    };

    observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
  };

  const initialState = await chrome.storage.local.get("switchState");
  const initialStateIsFalse =
    Object.keys(initialState).length === 0 ||
    initialState?.switchState === false;
  if (!initialStateIsFalse) {
    removeShorts();
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.action === "shorts off") {
      console.log("toz");
      removeShorts();
    }
    sendResponse({ result: "deleted" });
  });
})();
