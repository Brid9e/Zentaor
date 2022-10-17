chrome.contextMenus.create({
  id: 'open-zentao',
  title: '打开禅道'
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case 'open-zentao':
      chrome.tabs.create({ url: 'http://zentao.xzxyun.com/zentao/my-work-task.html' });
      break;
  }
});
