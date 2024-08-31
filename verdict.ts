(async () => {
  // to avoid conflicts with other stylesheets
  const HASH = "0907dad0-5e3e-45b6-9275-785aa0c25487";

  const showModal = (encouragement: string): void => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("./modalStyles.css");
    document.head.appendChild(link);

    const body = document.querySelector("body");

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add(`modalWrapper_${HASH}`);

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
    }
  };

  const stopVideoPlayer = () => {
    const videoPlayer = document.querySelector(
      ".video-stream.html5-main-video"
    ) as HTMLVideoElement | null;
    if (videoPlayer) {
      videoPlayer.pause();
      //this event listener is needed because some script inside youtube is playing the video after it is paused
      videoPlayer.addEventListener("playing", () => {
        videoPlayer.pause();
      });
    }
  };

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (!request.relevant) {
        // check if there is already a modal in the current Page
        const modal = document.querySelector(`.modalWrapper_${HASH}`);
        if (!modal) {
          if (
            document.readyState === "interactive" ||
            document.readyState === "complete"
          ) {
            showModal(request.encouragement);
            stopVideoPlayer();
          } else {
            document.addEventListener("DOMContentLoaded", () => {
              showModal(request.encouragement);
              stopVideoPlayer();
            });
          }
        }
      }
    }
  );
})();
