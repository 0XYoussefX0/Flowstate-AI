(async () => {
  const inputContainer = document.getElementById("inputContainer");
  const input = document.getElementById("goal") as HTMLTextAreaElement;
  const saveButton = document.getElementById("saveButton") as HTMLButtonElement;
  const editButton = document.getElementById("editButton") as HTMLButtonElement;

  if (editButton) {
    editButton.addEventListener("click", () => {
      input.disabled = false;
      saveButton.disabled = false;
      if (inputContainer) {
        inputContainer.removeEventListener("mouseenter", showEditButton);
      }
      editButton.style.visibility = "hidden";
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "send user input") {
      if (input) {
        sendResponse(input.value);
      }
    }
  });

  const switchElement = document.getElementById("switch");

  /* some of the switch related code was copied from w3c and i've modified it */
  const sendMessage = async (state: boolean) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab?.id) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: !state ? "shorts off" : "shorts on",
      });
    }
  };

  if (switchElement) {
    const initialState = await chrome.storage.local.get("switchState");
    const initialStateIsFalse =
      Object.keys(initialState).length === 0 ||
      initialState?.switchState === false;
    switchElement.setAttribute("aria-checked", String(!initialStateIsFalse));

    const toggleSwitch = async () => {
      const switchState = switchElement.getAttribute("aria-checked") === "true";
      await chrome.storage.local.set({ switchState: !switchState });
      switchElement.setAttribute("aria-checked", String(!switchState));
      sendMessage(switchState);
    };

    switchElement.addEventListener("click", () => {
      toggleSwitch();
    });

    switchElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        toggleSwitch();
      }
    });
  }

  const showEditButton = () => {
    if (editButton) {
      editButton.style.visibility = "visible";
    }
  };

  if (saveButton) {
    saveButton.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.storage.local.set({ textInput: input.value });
      input.disabled = true;
      saveButton.disabled = true;
      if (inputContainer) {
        inputContainer.addEventListener("mouseenter", showEditButton);
      }
    });
  }

  if (input) {
    const inputData = await chrome.storage.local.get("textInput");
    input.value = inputData.textInput;
  }
})();
