// Initialize butotn with users's prefered color
let syncData = document.getElementById("syncData");

chrome.storage.sync.get("msg", ({ msg }) => {
  // syncData.style.backgroundColor = color;
  console.log(msg)
});

chrome.storage.onChanged.addListener((id, info, tab) => {
  console.log(id, info, tab)
  // if (tab.status === 'loading') {
  //   updateBrowserAction(id, tab.url);
  // }
});


// When the button is clicked, inject setPageBackgroundColor into current page
syncData.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("msg", () => {
    chrome.syncDatas(true)
  });
}


// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('收到来自bj的消息：');
//   console.log(request, sender, sendResponse);
//   data = request
//   sendResponse(request);
// });
