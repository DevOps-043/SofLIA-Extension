// Basic DOM Reader
console.log('Lia Extension Content Script loaded');

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_DOM_CONTEXT') {
    const context = getPageContext();
    sendResponse(context);
  }
  return true; // Keep channel open for async response
});

function getPageContext() {
  // 1. Get main content (simplified)
  // In a real generic agent, we might use @mozilla/readability here.
  // For now, let's grab the body text and clean it up.
  
  const bodyClone = document.body.cloneNode(true) as HTMLElement;
  
  // Remove scripts, styles, and hidden elements to reduce noise
  const scripts = bodyClone.querySelectorAll('script, style, noscript, iframe, svg');
  scripts.forEach(el => el.remove());

  // Helper to remove comments
  const removeComments = (node: Node) => {
    let child = node.firstChild;
    while (child) {
        const next = child.nextSibling;
        if (child.nodeType === 8) { // Comment node
            node.removeChild(child);
        } else if (child.nodeType === 1) { // Element node
            removeComments(child);
        }
        child = next;
    }
  };
  removeComments(bodyClone);

  // Get text content, compressing whitespace
  let text = bodyClone.innerText || bodyClone.textContent || "";
  text = text.replace(/\s+/g, ' ').trim();

  // Limit size to avoid Token Limit issues (naive approach)
  const maxLength = 20000; 
  if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "... [Truncated]";
  }

  return {
    url: window.location.href,
    title: document.title,
    content: text
  };
}
