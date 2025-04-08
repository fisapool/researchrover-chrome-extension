(()=>{var e={};function t(){browser.runtime.lastError?console.log("Error: ".concat(browser.runtime.lastError)):console.log("Item created successfully")}"undefined"!=typeof chrome&&chrome&&(browser=chrome),browser.runtime.onInstalled.addListener(function(e){"install"===e.reason&&browser.tabs.create({url:"https://scite.ai/extension-install"})}),// Track color scheme changes
// Theme management
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function handleThemeChange(e) {
  const isDark = e.matches;
  const theme = isDark ? 'dark' : 'light';
  
  // Update theme attribute
  document.documentElement.setAttribute('data-theme', theme);
  
  // Notify content scripts about theme change
  browser.tabs.query({}).then(tabs => {
    tabs.forEach(tab => {
      browser.tabs.sendMessage(tab.id, {
        type: 'THEME_CHANGED',
        theme: theme
      }).catch(() => {
        // Ignore errors for tabs that don't have our content script
      });
    });
  });
}

// Listen for system theme changes
themeMediaQuery.addEventListener('change', handleThemeChange);

// Set initial theme
handleThemeChange(themeMediaQuery);

browser.contextMenus.create({id:"scite-citation-search",title:"Ask scite.ai assistant",contexts:["selection"]},t),browser.contextMenus.onClicked.addListener(function(e,t) {
  if ("scite-citation-search" === e.menuItemId && e.selectionText) {
    var r = encodeURIComponent("".concat(e.selectionText));
    
    // Check if selected text is from a PDF
    if (t.url.toLowerCase().endsWith('.pdf')) {
      // Create PDF preview window
      browser.windows.create({
        url: browser.runtime.getURL('pdf-preview.html') + 
             '?text=' + r + '&url=' + encodeURIComponent(t.url),
        type: 'popup',
        width: 800,
        height: 600
      });
    } else {
      browser.tabs.create({
        url: "https://scite.ai/assistant?startTerm=".concat(r,
            "&utm_source=generic&utm_medium=plugin&utm_campaign=plugin-citation-search")
      });
    }
  }
})})();