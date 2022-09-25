// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("msg", ({ msg }) => {
  // changeColor.style.backgroundColor = color;
  console.log(msg)
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

window.addEventListener('beforeunload', async (e) => {
  console.log(e)
})

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("msg", ({ msg }) => {
    // document.body.style.backgroundColor = color;
    // console.log(msg)
    console.log(window.localStorage)
    // window.init()
  });
}
