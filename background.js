
// Initialize browser API compatibility
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
  globalThis.browser = chrome;
}

// Helper function for error handling
function handleError() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log('Item created successfully');
  }
}

// Theme management
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function handleThemeChange(e) {
  const isDark = e.matches;
  const theme = isDark ? 'dark' : 'light';
  
  // Update theme in storage
  browser.storage.local.set({ theme });
  
  // Notify content scripts
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

// Create context menu
browser.contextMenus.create({
  id: "scite-citation-search",
  title: "Ask scite.ai assistant",
  contexts: ["selection"]
}, handleError);

// Handle context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scite-citation-search" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    
    if (tab.url.toLowerCase().endsWith('.pdf')) {
      browser.windows.create({
        url: browser.runtime.getURL('pdf-preview.html') + 
             '?text=' + query + '&url=' + encodeURIComponent(tab.url),
        type: 'popup',
        width: 800,
        height: 600
      });
    } else {
      browser.tabs.create({
        url: `https://scite.ai/assistant?startTerm=${query}&utm_source=generic&utm_medium=plugin&utm_campaign=plugin-citation-search`
      });
    }
  }
});
