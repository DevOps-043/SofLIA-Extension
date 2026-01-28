console.log('Lia Content Script loaded');

// ============================================
// DOM Analysis Functions
// ============================================

function generateElementId(element: Element, index: number): string {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const classes = element.className && typeof element.className === 'string' 
    ? `.${element.className.split(' ').filter(c => c).join('.')}` 
    : '';
  return `[${index}]${tag}${id}${classes}`.substring(0, 100);
}

function getVisibleText(element: Element): string {
  const text = element.textContent?.trim() || '';
  return text.substring(0, 150);
}

function getStructuredDOM(): object {
  const interactiveElements: any[] = [];
  
  const selectors = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[onclick]',
    '[tabindex]'
  ];
  
  const elements = document.querySelectorAll(selectors.join(','));
  
  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    
    if (rect.width === 0 && rect.height === 0) return;
    if (window.getComputedStyle(el).display === 'none') return;
    if (window.getComputedStyle(el).visibility === 'hidden') return;
    
    const elementInfo: any = {
      id: generateElementId(el, index),
      tag: el.tagName.toLowerCase(),
      text: getVisibleText(el),
      attributes: {}
    };
    
    if (el instanceof HTMLAnchorElement) {
      elementInfo.attributes.href = el.href;
    }
    if (el instanceof HTMLInputElement) {
      elementInfo.attributes.type = el.type;
      elementInfo.attributes.name = el.name;
      elementInfo.attributes.placeholder = el.placeholder;
      elementInfo.attributes.value = el.type !== 'password' ? el.value : '***';
    }
    if (el instanceof HTMLButtonElement || el.getAttribute('role') === 'button') {
      elementInfo.type = 'button';
    }
    if (el.hasAttribute('aria-label')) {
      elementInfo.ariaLabel = el.getAttribute('aria-label');
    }
    
    elementInfo.position = {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      visible: rect.top >= 0 && rect.top < window.innerHeight
    };
    
    interactiveElements.push(elementInfo);
  });
  
  return {
    url: window.location.href,
    title: document.title,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY
    },
    interactiveElements: interactiveElements.slice(0, 100),
    headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
      level: h.tagName,
      text: h.textContent?.trim().substring(0, 100)
    })).slice(0, 20),
    mainContent: document.body.innerText.substring(0, 3000)
  };
}

function getPageContent(): string {
  return document.body.innerText;
}

function executeAction(action: { type: string; selector?: string; value?: string; index?: number }): { success: boolean; message: string } {
  try {
    let element: Element | null = null;
    
    if (action.selector) {
      element = document.querySelector(action.selector);
    } else if (typeof action.index === 'number') {
      const selectors = 'a[href], button, input, select, textarea, [role="button"], [role="link"], [onclick]';
      const elements = document.querySelectorAll(selectors);
      element = elements[action.index] || null;
    }
    
    if (!element) {
      return { success: false, message: 'Elemento no encontrado' };
    }
    
    switch (action.type) {
      case 'click':
        (element as HTMLElement).click();
        return { success: true, message: `Click ejecutado en ${element.tagName}` };
        
      case 'type':
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.value = action.value || '';
          element.dispatchEvent(new Event('input', { bubbles: true }));
          return { success: true, message: `Texto escrito: ${action.value}` };
        }
        return { success: false, message: 'El elemento no es un campo de texto' };
        
      case 'scroll':
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return { success: true, message: 'Scroll ejecutado' };
        
      case 'focus':
        (element as HTMLElement).focus();
        return { success: true, message: 'Focus aplicado' };
        
      default:
        return { success: false, message: `Acción desconocida: ${action.type}` };
    }
  } catch (error) {
    return { success: false, message: `Error: ${error}` };
  }
}

// ============================================
// Text Selection Popup
// ============================================

let selectionPopup: HTMLDivElement | null = null;
let currentSelection = '';

function handleButtonClick(action: string) {
  console.log('Button clicked:', action, 'Current selection:', currentSelection);
  
  if (!currentSelection) {
    console.log('No selection to process');
    return;
  }
  
  let prompt = '';
  
  switch (action) {
    case 'ask':
      prompt = `Tengo una pregunta sobre este texto: "${currentSelection}"`;
      break;
    case 'explain':
      prompt = `Explícame este texto de forma sencilla: "${currentSelection}"`;
      break;
    case 'summarize':
      prompt = `Resume este texto: "${currentSelection}"`;
      break;
    case 'translate':
      prompt = `Traduce este texto al inglés: "${currentSelection}"`;
      break;
    default:
      prompt = currentSelection;
  }
  
  console.log('Sending to Lia:', prompt.substring(0, 100) + '...');
  
  // Send to extension background
  chrome.runtime.sendMessage({
    type: 'SELECTION_ACTION',
    action: action,
    text: currentSelection,
    prompt: prompt
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError);
    } else {
      console.log('Message sent successfully:', response);
    }
  });
  
  hideSelectionPopup();
  currentSelection = '';
}

function createSelectionPopup() {
  if (selectionPopup) return;
  
  // Create host element
  const host = document.createElement('div');
  host.id = 'lia-selection-popup-host';
  host.style.cssText = 'position: fixed; z-index: 2147483647; display: none;';
  
  // Create shadow root for isolation
  const shadow = host.attachShadow({ mode: 'closed' });
  
  // Add styles inside shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .lia-popup {
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      animation: liaFadeIn 0.15s ease-out;
    }
    
    @keyframes liaFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .lia-popup-content {
      display: flex;
      gap: 4px;
    }
    
    .lia-popup-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    
    .lia-popup-btn:hover {
      background: #00d4b3;
      color: #0a2540;
    }
    
    .lia-popup-btn svg {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }
  `;
  shadow.appendChild(style);
  
  // Create popup container inside shadow
  const popup = document.createElement('div');
  popup.className = 'lia-popup';
  
  const content = document.createElement('div');
  content.className = 'lia-popup-content';
  
  // Button definitions
  const buttons = [
    { action: 'ask', label: 'Preguntar a Lia', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' },
    { action: 'explain', label: 'Explicar', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>' },
    { action: 'summarize', label: 'Resumir', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>' },
    { action: 'translate', label: 'Traducir', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>' }
  ];
  
  buttons.forEach(({ action, label, icon }) => {
    const btn = document.createElement('button');
    btn.className = 'lia-popup-btn';
    btn.innerHTML = icon + ' ' + label;
    
    // Use onclick property for maximum compatibility
    btn.onclick = function(e) {
      console.log('LIA SHADOW BUTTON CLICKED:', action);
      e.preventDefault();
      e.stopPropagation();
      handleButtonClick(action);
      return false;
    };
    
    content.appendChild(btn);
  });
  
  popup.appendChild(content);
  shadow.appendChild(popup);
  
  document.body.appendChild(host);
  selectionPopup = host;
  console.log('Lia selection popup created with Shadow DOM');
}

function showSelectionPopup(x: number, y: number) {
  if (!selectionPopup) createSelectionPopup();
  if (!selectionPopup) return;
  
  const popupWidth = 420;
  const popupHeight = 50;
  
  // Center horizontally relative to selection
  let left = x - popupWidth / 2;
  
  // Position above the selection (y is already viewport-relative from getBoundingClientRect)
  let top = y - popupHeight - 10;
  
  // Keep within horizontal viewport bounds
  if (left < 10) left = 10;
  if (left + popupWidth > window.innerWidth - 10) {
    left = window.innerWidth - popupWidth - 10;
  }
  
  // If popup would go above viewport, put it below the selection instead
  if (top < 10) {
    top = y + 25;
  }
  
  selectionPopup.style.left = `${left}px`;
  selectionPopup.style.top = `${top}px`;
  selectionPopup.style.display = 'block';
  console.log('Lia popup shown at:', left, top);
}

function hideSelectionPopup() {
  if (selectionPopup) {
    selectionPopup.style.display = 'none';
  }
}

// Listen for text selection
document.addEventListener('mouseup', (e) => {
  // Skip if clicking inside popup
  if (selectionPopup && selectionPopup.contains(e.target as Node)) {
    return;
  }
  
  // Small delay to let selection complete
  setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 3 && selectedText.length < 5000) {
      currentSelection = selectedText;
      console.log('Lia: Text selected, length:', selectedText.length);
      
      try {
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          // rect.top is already viewport-relative, which is what we need for position:fixed
          showSelectionPopup(
            rect.left + rect.width / 2,
            rect.top
          );
        }
      } catch (err) {
        console.log('Could not get selection range');
      }
    } else if (!selectionPopup?.contains(e.target as Node)) {
      hideSelectionPopup();
      currentSelection = '';
    }
  }, 50);
});

// Hide popup on click elsewhere (but not on buttons)
document.addEventListener('mousedown', (e) => {
  const target = e.target as HTMLElement;
  if (selectionPopup && !selectionPopup.contains(target)) {
    hideSelectionPopup();
  }
});

// Hide on scroll
document.addEventListener('scroll', () => {
  hideSelectionPopup();
}, true);

// ============================================
// Message Listener
// ============================================

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  switch (request.action) {
    case 'ping':
      // Respond to ping from background to check if script is loaded
      sendResponse({ pong: true });
      break;
      
    case 'getPageContent':
      sendResponse({ content: getPageContent() });
      break;
      
    case 'getStructuredDOM':
      sendResponse({ dom: getStructuredDOM() });
      break;
      
    case 'executeAction':
      const result = executeAction(request.actionData);
      sendResponse(result);
      break;
      
    case 'getSelectedText':
      sendResponse({ text: currentSelection });
      break;
      
    default:
      sendResponse({ error: 'Acción no reconocida' });
  }
  
  return true;
});
