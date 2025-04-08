(()=>{var e={};function t(){browser.runtime.lastError?console.log("Error: ".concat(browser.runtime.lastError)):console.log("Item created successfully")}"undefined"!=typeof chrome&&chrome&&(browser=chrome),browser.runtime.onInstalled.addListener(function(e){"install"===e.reason&&browser.tabs.create({url:"https://scite.ai/extension-install"})}),// Track color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  updateTheme();
});

function updateTheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

browser.contextMenus.create({id:"scite-citation-search",title:"Ask scite.ai assistant",contexts:["selection"]},t),browser.contextMenus.onClicked.addListener(function(e,t){if("scite-citation-search"===e.menuItemId&&e.selectionText){var r=encodeURIComponent("".concat(e.selectionText));browser.tabs.create({url:"https://scite.ai/assistant?startTerm=".concat(r,"&utm_source=generic&utm_medium=plugin&utm_campaign=plugin-citation-search")})}})})();