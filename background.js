
chrome.runtime.onInstalled.addListener(() => {
  const msg = {
    code: 200,
    data: [{ test: 1 }]
  }
  chrome.storage.sync.set({ msg });
  // console.log('Default background color set to %cgreen', `color: ${color}`);
});
