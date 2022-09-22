// if (sendMessageId) {
//   pushMsgToBg(sendMessageId)
//   // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   //   chrome.tabs.sendMessage(
//   //     tabs[0].id,
//   //     {
//   //       url: chrome.runtime.getURL("icons/zentao16x16.png"),
//   //       imageDivId: `${guidGenerator()}`,
//   //       tabId: tabs[0].id
//   //     },
//   //     function (response) {
//   //       window.close();
//   //     }
//   //   );
//   //   function guidGenerator() {
//   //     const S4 = function () {
//   //       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//   //     };
//   //     return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
//   //   }
//   // });
// }
// function pushMsgToBg() {
const sendMessageId = document.getElementById("sendmessageid");
//初始化bgCommunicationPort
window.bgCommunicationPort = chrome.runtime.connect();
//给bg发消息
sendMessageId.addEventListener("click", async () => {
  let input_value = $('#InputContent').val()
  alert(input_value)
  bgCommunicationPort.postMessage({//发送到bg,键值可以自由设置
    Content: 'content',//说明
    Input_value: input_value,//数据
    step: 0//步骤
  });
})

  // //打开popup时触发，读取之前存储的参数
  // $(document).ready(function () {
  //   bgCommunicationPort.postMessage({ fromPopup: 'getDB' });//向background发送消息
  //   bgCommunicationPort.onMessage.addListener(function (receivedPortMsg) {//监听background
  //     console.log(receivedPortMsg);//这是background发来的内容
  //     if (receivedPortMsg && receivedPortMsg.input_value) {
  //       $('InputContent').val(receivedPortMsg.input_value)
  //     }
  //   });
  // });
