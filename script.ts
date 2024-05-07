(async () => {
  let observer: MutationObserver;

  const isShortVideo = (node: Element): boolean => {
    if (node.textContent === "SHORTS") {
      return true;
    }
    if (node.hasChildNodes()) {
      for (const childNode of node.children) {
        if (isShortVideo(childNode)) {
          return true;
        }
      }
    }
    return false;
  };

  const removeShortsLink = () => {
    return new Promise((resolve, reject) => {
      const shortsLink = document.querySelector(
        "#items > ytd-guide-entry-renderer:nth-child(2)"
      );
      if (shortsLink) {
        shortsLink.remove();
        resolve(true);
      } else {
        setTimeout(() => {
          removeShortsLink();
        }, 100);
      }
    });
  };

  const removeShortsButton = () => {
    return new Promise((resolve, reject) => {
      const shortsButton = document.querySelector(
        "#chips > yt-chip-cloud-chip-renderer:nth-child(2)"
      );
      if (shortsButton) {
        shortsButton.remove();
        resolve(true);
      } else {
        setTimeout(() => {
          removeShortsButton();
        }, 100);
      }
    });
  };

  const getTargetNode = () => {
    return new Promise((resolve, reject) => {
      const targetNode = document.querySelector("#contents");
      if (!targetNode) {
      }
    });
  };

  const removeShorts = () => {
    // this code is for listening for dom changes that occur in the body, it was copied from an article i found online and i made some changes to it

    const targetNode = document.querySelector("#contents");

    if (!targetNode) return;
    const config = { childList: true };

    removeShortsLink();

    removeShortsButton();

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
          const shortReels = document.querySelector("ytd-reel-shelf-renderer");
          if (shortReels) {
            shortReels.remove();
          }
          //this code should be improved to be faster
          const videoList = document.querySelectorAll("ytd-video-renderer");
          videoList.forEach((video) => {
            if (isShortVideo(video)) {
              video.remove();
            }
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

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.action === "shorts off") {
        removeShorts();
        sendResponse({ result: "deleted" });
      } else if (request.type === "new video") {
        const response = await fetch(
          `http://127.0.0.1:5000/youtube_transcript?videoId=${request.videoId}`
        );
        if (response.ok) {
          const data = await response.json();
        }
      }
    }
  );
})();
