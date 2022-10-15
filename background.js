
// chrome.runtime.onInstalled.addListener(() => {
//   // const msg = {
//   //   code: 200,
//   //   data: [{ test: 2131231231 }]
//   // }
//   // console.log(window.localStorage)

//   // console.log('Default background color set to %cgreen', `color: ${color}`);
// });


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("msg", ({ msg }) => {
    // syncData.style.backgroundColor = color;
    console.log(msg)
  });

  // console.log('Default background color set to %cgreen', `color: ${color}`);
});
// 监听来自content-script的消息
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('收到来自content-script的消息：');
//   console.log(request, sender, sendResponse);
//   data = request
//   sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
//   chrome.storage.sync.set({ request });
// });

// const getData = () => {
//   return data
// }



// const tabStorage = {};

// (function () {

//   getTabs();

//   chrome.tabs.onRemoved.addListener((tab) => {
//     getTabs();
//   });

//   chrome.tabs.onUpdated.addListener((tab) => {
//     getTabs();
//   });

// }());

// function getTabs() {
//   console.clear();
//   chrome.windows.getAll({ populate: true }, function (windows) {
//     windows.forEach(function (window) {
//       window.tabs.forEach(function (tab) {
//         //collect all of the urls here, I will just log them instead
//         tabStorage.tabUrl = tab.url;
//         console.log(tabStorage.tabUrl);
//       });
//     });
//   });
// }
