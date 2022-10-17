// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.get("msg", ({ msg }) => {
//     // syncData.style.backgroundColor = color;
//   });
//   // console.log('Default background color set to %cgreen', `color: ${color}`);
// });

// chrome.contextMenus.create({
//   id: 'open-zentao',
//   title: '打开禅道'
// });

// chrome.contextMenus.onClicked.addListener(function (info, tab) {
//   switch (info.menuItemId) {
//     case 'open-zentao':
//       chrome.tabs.create({ url: 'http://zentao.xzxyun.com/zentao/my-work-task.html' });
//       break;
//   }
// });

// 监听来自content-script的消息
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   // console.log('收到来自content-script的消息：');
//   // console.log(request, sender, sendResponse)
//   if (request.from === 'content') {
//     sendResponse(request);
//     data = request.data
//   }
//   if (request.from === 'popup') {
//     sendResponse(data || '还没获取到数据');
//   }
// });

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
