// Initialize butotn with users's prefered color
let syncData = document.getElementById("syncData");
let fromBg = document.getElementById("fromBg");
const darkLight = document.getElementById("dark-light");
// chrome.storage.sync.get("msg", ({ msg }) => {
//   // syncData.style.backgroundColor = color;
//   console.log(msg)
// });

if (!localStorage.model) {
  localStorage.model = 'light'
}

// When the button is clicked, inject setPageBackgroundColor into current page
syncData.addEventListener("click", async () => {
  syncData.firstChild.classList.add('loading')
  if (isLoading) {
    return
  }
  syncDatas(true)
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: setPageBackgroundColor,
  // });
});

// The body of this function will be execuetd as a content script inside the
// current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("msg", () => {
//     chrome.syncDatas(true)
//   });
// }

// const bg = chrome.extension.getBackgroundPage()
// setInterval(() => {
//   chrome.runtime.sendMessage({ code: 200, from: 'popup' }, (res) => {
//     console.log('我收到了来自background的消息', res)
//     if (res.month_data || res.day_data || res.all_data) {
//       localStorage.log_history = JSON.stringify(res)
//     }
//   });
// }, 500);


class Model {
  dark() {
    document.documentElement.style.setProperty("--color-bg", "var(--color-dark)");
    document.documentElement.style.setProperty("--color-font", "var(--color-info-4)");
    document.documentElement.style.setProperty("--color-hover", "var(--color-sub-dark)");
    document.documentElement.style.setProperty("--color-hover-1", "var(--color-light)");
    document.documentElement.style.setProperty("--color-high-light", "var(--color-light)");
    // --color-info-4
  }
  light() {
    document.documentElement.style.setProperty("--color-bg", "var(--color-light)");
    document.documentElement.style.setProperty("--color-font", "var(--color-info)");
    document.documentElement.style.setProperty("--color-hover", "var(--color-sub)");
    document.documentElement.style.setProperty("--color-hover-1", "var(--color-primary)");
    document.documentElement.style.setProperty("--color-high-light", "var(--color-font)");
  }
}
const _model = new Model

window.onload = () => {
  if (localStorage.model == 'light') {
    _model.light()
  } else {
    _model.dark()
    localStorage.model = 'dark'
  }
}

darkLight.addEventListener("click", () => {
  if (localStorage.model == 'light') {
    _model.dark()
    localStorage.model = 'dark'
  } else {
    _model.light()
    localStorage.model = 'light'
  }
});

