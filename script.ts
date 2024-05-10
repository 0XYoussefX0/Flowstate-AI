(async () => {
  const MAXIMUM_NUM_OF_CALLS = 10;

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
        const config = { childList: true };

        const callback = function (
          mutationsList: MutationRecord[],
          observer: MutationObserver
        ) {
          for (const mutation of mutationsList) {
            if (mutation.addedNodes) {
              const shortReelsSections = document.querySelectorAll(
                "ytd-reel-shelf-renderer"
              );
              shortReelsSections.forEach((shortReelSection) => {
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
              const shortsSections = document.querySelectorAll(
                "ytd-rich-section-renderer"
              );
              shortsSections.forEach((shortSection) => {
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
    console.log(initialState.switchState);
    const initialStateIsFalse =
      Object.keys(initialState).length === 0 ||
      initialState?.switchState === false;
    if (!initialStateIsFalse) {
      removeShorts();
    }
  };

  checkSwitchState();

  const showModal = (encouragement: string): void => {
    console.log(encouragement);
    // the next 5 lines were copied from ChatGPT
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("./modalStyles.css");
    document.head.appendChild(link);

    const body = document.querySelector("body");

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add("modalWrapper");

    const backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");

    const warningIcon = document.createElement("img");
    warningIcon.src = chrome.runtime.getURL("./assets/warningIcon.svg");
    warningIcon.alt = "";

    const modalHeader = document.createElement("h1");
    modalHeader.textContent = "You are not allowed to watch this.";

    const modalParagraph = document.createElement("p");
    modalParagraph.textContent = encouragement;

    const modalLink = document.createElement("a");
    modalLink.textContent = "Go back to the home page";
    modalLink.href = "https://www.youtube.com";

    const runningIcon = document.createElement("img");
    runningIcon.src = chrome.runtime.getURL("./assets/runningIcon.png");
    runningIcon.alt = "";
    runningIcon.width = 20;
    runningIcon.height = 20;
    modalLink.appendChild(runningIcon);

    modalWrapper.append(warningIcon, modalHeader, modalParagraph, modalLink);

    if (body) {
      body.append(modalWrapper, backdrop);
      body.style.overflowY = "hidden";
    }
  };

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
          const inputData = await chrome.storage.local.get("textInput");

          const requestBody = {
            goal: inputData.textInput,
            videoTranscript: data.transcript,
          };
          const geminiResponse = await fetch("http://127.0.0.1:5000/gemini", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });
          if (geminiResponse.ok) {
            const geminiOutput = await geminiResponse.json();
            if (geminiOutput.verdict === "Not Allowed") {
              showModal(geminiOutput.encouragement);
            }
          }
        }
      } else if (request.type === "url changed") {
        checkSwitchState();
      }
    }
  );
})();

/* add the run at attribute in the manifest json file */
