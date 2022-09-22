// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let changeValue = document.getElementById("changeValue");

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


changeValue.addEventListener("input", (e) => {
  console.log(e.target.value)
})

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("msg", ({ msg }) => {
    // document.body.style.backgroundColor = color;
    // console.log(msg)
    let params = {
      time: ''
    }

    window.initIndex(params)

    // window.init()
  });
}
