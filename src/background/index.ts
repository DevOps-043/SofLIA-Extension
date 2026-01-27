console.log('Lia Extension Background Service Worker running');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Lia Extension installed');
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});
