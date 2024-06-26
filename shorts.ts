(async () => {
  const MAXIMUM_NUM_OF_CALLS = 60;

  const removeShortsLink = () => {
    const shortsLink = document.querySelector(
      "#items > ytd-guide-entry-renderer:nth-child(2)"
    );
    if (
      shortsLink &&
      shortsLink.children[0].getAttribute("title") == "Shorts"
    ) {
      shortsLink.remove();
    } else {
      setTimeout(() => {
        removeShortsLink();
      }, 100);
    }
  };

  const removeShortsButton = () => {
    const shortsButton = document.querySelector(
      "#chips.style-scope.yt-chip-cloud-renderer > yt-chip-cloud-chip-renderer:nth-child(2)"
    );
    /*document.querySelectorAll("#contents.style-scope.ytd-rich-grid-renderer")
     */
    if (
      shortsButton &&
      shortsButton.children[0].getAttribute("title") == "Shorts"
    ) {
      shortsButton.remove();
    } else {
      setTimeout(() => {
        removeShortsButton();
      }, 100);
    }
  };

  let numCallsRemoveSearchShorts = 0;
  const removeSearchShorts = () => {
    numCallsRemoveSearchShorts++;
    // if the shorts don't exist in the search page this will ensure that the function is not stuck in an infinite loop
    if (numCallsRemoveSearchShorts === MAXIMUM_NUM_OF_CALLS) {
      return;
    }
    const shortReelsSections = document.querySelectorAll(
      "ytd-reel-shelf-renderer"
    );
    if (shortReelsSections.length > 0) {
      shortReelsSections.forEach((shortReelSection) => {
        shortReelSection.remove();
      });
      const target = document.querySelector(
        "#contents.style-scope.ytd-section-list-renderer"
      );
      if (target) {
        const config = { childList: true, subtree: true };

        const callback = function (
          mutationsList: MutationRecord[],
          observer: MutationObserver
        ) {
          for (const mutation of mutationsList) {
            if (mutation.addedNodes) {
              const shortReelsSections2 = document.querySelectorAll(
                "ytd-reel-shelf-renderer"
              );
              shortReelsSections2.forEach((shortReelSection) => {
                shortReelSection.remove();
              });
            }
          }
        };

        const observer = new MutationObserver(callback);

        observer.observe(target, config);
      }
    } else {
      setTimeout(() => {
        removeSearchShorts();
      }, 100);
    }
  };

  let numCallsRemoveHomePageShorts = 0;
  const removeHomePageShorts = () => {
    numCallsRemoveHomePageShorts++;
    // if the shorts don't exist in the search page this will ensure that the function is not stuck in an infinite loop
    if (numCallsRemoveHomePageShorts === MAXIMUM_NUM_OF_CALLS) {
      return;
    }
    const shortsSections = document.querySelectorAll(
      "ytd-rich-section-renderer"
    );
    if (shortsSections.length > 0) {
      shortsSections.forEach((shortSection) => {
        shortSection.remove();
      });
      const target = document.querySelector(
        "#contents.style-scope.ytd-rich-grid-renderer"
      );
      if (target) {
        const config = { childList: true };

        const callback = function (
          mutationsList: MutationRecord[],
          observer: MutationObserver
        ) {
          for (const mutation of mutationsList) {
            if (mutation.addedNodes) {
              const shortsSections2 = document.querySelectorAll(
                "ytd-rich-section-renderer"
              );
              shortsSections2.forEach((shortSection) => {
                shortSection.remove();
              });
            }
          }
        };

        const observer = new MutationObserver(callback);

        observer.observe(target, config);
      }
    } else {
      setTimeout(() => {
        removeHomePageShorts();
      }, 100);
    }
  };

  let numCallsRemoveWatchPageShorts = 0;
  const removeWatchPageShorts = () => {
    numCallsRemoveWatchPageShorts++;
    // if the shorts don't exist in the search page this will ensure that the function is not stuck in an infinite loop
    if (numCallsRemoveWatchPageShorts === MAXIMUM_NUM_OF_CALLS) {
      return;
    }
    const shortReelsSections = document.querySelector(
      "ytd-reel-shelf-renderer"
    );
    if (shortReelsSections) {
      shortReelsSections.remove();
    } else {
      setTimeout(() => {
        removeWatchPageShorts();
      }, 100);
    }
  };

  let numCallsRemoveSubPageShorts = 0;
  const removeSubPageShorts = () => {
    numCallsRemoveSubPageShorts++;
    // if the shorts don't exist in the search page this will ensure that the function is not stuck in an infinite loop
    if (numCallsRemoveSubPageShorts === MAXIMUM_NUM_OF_CALLS) {
      return;
    }
    const shortsSections = document.querySelectorAll(
      "ytd-rich-section-renderer"
    );
    if (shortsSections.length > 1) {
      shortsSections[1].remove();
    } else {
      setTimeout(() => {
        removeSubPageShorts();
      }, 100);
    }
  };

  const removeShorts = () => {
    // this code is for listening for dom changes that occur in the body, it was copied from an article i found online and i made some changes to it
    const tabURL = location.href;

    if (!tabURL.includes("youtube.com/watch")) {
      removeShortsLink();
    }

    if (tabURL.includes("youtube.com/results")) {
      removeShortsButton();
      removeSearchShorts();
    } else if (tabURL === "https://www.youtube.com/") {
      removeHomePageShorts();
    } else if (tabURL.includes("youtube.com/watch")) {
      removeWatchPageShorts();
    } else if (tabURL === "https://www.youtube.com/feed/subscriptions") {
      removeSubPageShorts();
    }
  };

  const checkSwitchState = async () => {
    const initialState = await chrome.storage.local.get("switchState");
    const initialStateIsFalse =
      Object.keys(initialState).length === 0 ||
      initialState?.switchState === false;
    if (!initialStateIsFalse) {
      removeShorts();
    }
  };

  checkSwitchState();

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.action === "shorts off") {
        removeShorts();
      } else if (request.type === "url changed") {
        checkSwitchState();
      }
    }
  );
})();
