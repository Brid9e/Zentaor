// chrome.runtime.onMessage.addListener(function (senderRequest, sender, sendResponse) {//接收到content
//   console.log(senderRequest);
//   if (senderRequest.fromContent && senderRequest.fromContent == 'getDB') {
//     DBdata('get', function (res) {//从本地取数据
//       console.log(res);
//       if (res.LocalDB) {
//         var LocalDB = res.LocalDB;
//         switch (LocalDB.Content) {
//           case 'TEST':
//             chrome.tabs.query({
//               active: true,
//               currentWindow: true
//             }, function (tabs) {
//               chrome.tabs.sendMessage(tabs0.id, { LocalDB: LocalDB });//发送到content
//             });
//             break;
//           default:
//             break;
//         }

//       } else {
//         chrome.tabs.query({
//           active: true,
//           currentWindow: true
//         }, function (tabs) {
//           chrome.tabs.sendMessage(tabs[0].id, { msg: 'no data' });//发送到content
//         });
//       }
//     });
//   }
//   sendResponse('已接收')
// });


// //给background发消息
// chrome.runtime.sendMessage(chrome.runtime.id, {//当页面刷新时发送到bg
//   fromContent: 'getDB'
// });
// //从数据库取数据发送到content_script.js
// function sendToContent() {
//   DBdata('get', function (res) {
//     var LocalDB = res.LocalDB;
//     console.log(LocalDB)
//     chrome.tabs.query({
//       active: true, currentWindow: true
//     }, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, { LocalDB: LocalDB }, function (response) {
//         console.log(response)
//       });//发送到content
//     });
//   })
// }


// try { //监听脚本 监听来自popup的消息
//   chrome.runtime.onConnect.addListener(function (port) {//接收到popup
//     port.onMessage.addListener(function (receivedMsg) {//监听popup发来的内容receivedMsg
//       if (receivedMsg.fromPopup && receivedMsg.fromPopup == 'getDB') {//如果接收到了getDB，这里读取数据并返回相当于初始化popup页面
//         DBdata('get', function (res) {
//           port.postMessage(res.LocalDB);//发送到popup
//         });
//       } else {//如果不是，则说明是收到来自popup手动点击设置的数据，存入以用于popup打开时展示
//         DBdata('set', '', receivedMsg)
//         //发送消息给content_script;
//         sendToContent(receivedMsg)
//       }
//     })
//   });
// } catch {
//   console.error('ERROR')
// }


// background.js

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});