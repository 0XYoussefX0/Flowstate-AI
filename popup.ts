(async () => {
  const switchElement = document.getElementById("switch");

  /* some of the switch related code was also part of the code that i've copied from w3c and i've modified it */
  const sendMessage = async (state: boolean) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    console.log(tab);
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
})();
