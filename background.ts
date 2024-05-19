// this code is copied from a tutorial on freecodecamp and i'm modified it
// chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
//   console.log("run", tab.url);
//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     const queryParameters = tab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);

//     await chrome.tabs.sendMessage(tabId, {
//       type: "new video",
//       videoId: urlParameters.get("v"),
//     });
//   } else if (tab.url && tab.url.includes("youtube.com/shorts")) {
//     const state = await chrome.storage.local.get("switchState");
//     if (state.switchState === true) {
//       try {
//         await chrome.tabs.goBack(tabId);
//       } catch (e) {
//         // i used chatgpt for the next line to find a method that will help me push the user to the home page if they have remove shorts switch turned on
//         chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
//       }
//     }
//   }
// });

//copied this code from stack overflow to ensure that the content script reruns everytime the url updates
// chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
//   if (details.frameId === 0) {
//     // Fires only when details.url === currentTab.url
//     chrome.tabs.get(details.tabId, function (tab) {
//       if (tab.url === details.url && tab.url.includes("youtube.com")) {
//         if (tab.id) {
//           chrome.tabs.sendMessage(tab.id, {
//             type: "url changed",
//           });
//         }
//       }
//     });
//   }
// });

type Result = {
  verdict: "Allowed" | "Not Allowed";
  encouragement: string;
};

type Container<T> = {
  value: T;
  next?: Container<T>;
  prev?: Container<T>;
};

class LRU<K, V> {
  private length: number;
  private head?: Container<V>;
  private tail?: Container<V>;

  private lookup: Map<K, Container<V>>;
  private reverseLookup: Map<Container<V>, K>;

  constructor(private capacity: number) {
    this.length = 0;
    this.head = this.tail = undefined;
    this.lookup = new Map<K, Container<V>>();
    this.reverseLookup = new Map<Container<V>, K>();
  }

  private createNode<V>(value: V): Container<V> {
    return { value } as Container<V>;
  }

  insert(key: K, value: V): void {
    let Container = this.lookup.get(key);
    if (Container) {
      this.detatch(Container);
      this.prepend(Container);
    } else {
      const Container = this.createNode(value);
      this.length++;

      this.trimCache();
      this.prepend(Container);

      this.lookup.set(key, Container);
      this.reverseLookup.set(Container, key);
    }
  }

  get(key: K): V | undefined {
    const Container = this.lookup.get(key);
    if (!Container) {
      return undefined;
    }

    this.detatch(Container);
    this.prepend(Container);

    return Container.value;
  }

  private detatch(Container: Container<V>): void {
    if (Container.prev) {
      Container.prev.next = Container.next;
    }

    if (Container.next) {
      Container.next.prev = Container.prev;
    }

    if (this.head === Container) {
      this.head = this.head.next;
    }

    if (this.tail === Container) {
      this.tail = this.tail.prev;
    }

    Container.next = undefined;
    Container.prev = undefined;
  }

  private prepend(Container: Container<V>): void {
    if (!this.head) {
      this.head = this.tail = Container;
      return;
    }
    this.head.prev = Container;
    Container.next = this.head;
    this.head = Container;
  }

  private trimCache(): void {
    if (this.length <= this.capacity) {
      return;
    }
    const tail = this.tail as Container<V>;
    this.detatch(tail as Container<V>);
    this.lookup.delete(this.reverseLookup.get(tail) as K);
    this.reverseLookup.delete(tail);
    this.length--;
  }
}

const cache = new LRU<string, Result>(10);

let currentRequestId: string = "";

const fetchResult = async (videoId: string): Promise<Result | void> => {
  currentRequestId = videoId;
  const inputData = await chrome.storage.local.get("textInput");
  const requestBody = {
    goal: inputData.textInput,
    video_id: videoId,
  };
  const response = await fetch("http://127.0.0.1:5000/verdict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  currentRequestId = "";
  if (response.ok) {
    const data = (await response.json()) as Result;
    return data;
  }
};

let counter = 0;

const sendMessage = async (encouragement: string, tabId: number) => {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: "Not Allowed",
      encouragement: encouragement,
      counter,
    });
    counter++;
  } catch (e) {
    setTimeout(() => {
      sendMessage(encouragement, tabId);
    }, 100);
  }
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    const videoId = tab.url?.split("v=")[1];
    console.log(videoId);
    if (!videoId) return;
    // is the result for this videoId currently being requested ?
    if (currentRequestId === videoId) {
      return;
    }
    // check if the result for this videoId is in the cache
    const result = cache.get(videoId);
    console.log(result);
    if (result) {
      if (result.verdict === "Not Allowed") {
        sendMessage(result.encouragement, tabId);
      }
    } else {
      const result = await fetchResult(videoId);
      if (!result) return;
      if (result.verdict === "Not Allowed") {
        sendMessage(result.encouragement, tabId);
      }
      cache.insert(videoId, result);
      console.log(cache);
    }
  }
  if (tab.url && tab.url.includes("youtube.com/shorts")) {
    const state = await chrome.storage.local.get("switchState");
    if (state.switchState === true) {
      try {
        await chrome.tabs.goBack(tabId);
      } catch (e) {
        chrome.tabs.update(tabId, { url: "https://www.youtube.com/" });
      }
    }
  }
});
