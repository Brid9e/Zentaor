// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.get("msg", ({ msg }) => {
//     // syncData.style.backgroundColor = color;
//   });
//   // console.log('Default background color set to %cgreen', `color: ${color}`);
// });

chrome.contextMenus.create({
  title: "测试右键菜单",
  onclick: function () {
    chrome.notifications.create(null, {
      type: 'basic',
      // iconUrl: 'img/icon.png',
      title: '这是标题',
      message: '您刚才点击了自定义右键菜单！'
    });
  }
});
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
