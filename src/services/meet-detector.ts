/**
 * Google Meet Detection & CC Activation Service
 * Detects active meetings, enables captions, and tracks participants
 */

export interface MeetParticipant {
  id: string;
  name: string;
  isSpeaking: boolean;
}

export interface MeetingInfo {
  isActive: boolean;
  url: string;
  title: string;
  participants: MeetParticipant[];
  activeSpeaker: string | null;
}

/**
 * Check if current URL is a Google Meet meeting (not landing page)
 */
export function isGoogleMeetUrl(): boolean {
  const url = window.location.href;
  return url.includes('meet.google.com') &&
         !url.includes('/landing') &&
         /\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(url);
}

/**
 * Check if the meeting is active (user has joined)
 */
export function isMeetingActive(): boolean {
  const indicators = [
    'video',
    '[data-self-name]',
    '[aria-label*="Salir" i]',
    '[aria-label*="Leave" i]',
    '[aria-label*="Colgar" i]',
    '[aria-label*="Hang up" i]',
    'button[aria-label*="micrófono" i]',
    'button[aria-label*="microphone" i]',
    'button[aria-label*="cámara" i]',
    'button[aria-label*="camera" i]',
    '[data-is-muted]',
    '[data-call-id]',
    '[data-meeting-code]'
  ];

  return indicators.some(sel => {
    try {
      return document.querySelector(sel) !== null;
    } catch {
      return false;
    }
  });
}

/**
 * Get meeting title from the page
 */
export function getMeetingTitle(): string {
  // Simply use the meeting code from URL - most reliable
  const meetCode = window.location.pathname.split('/').pop();
  return meetCode ? `Reunión: ${meetCode}` : 'Google Meet';
}

/**
 * Check if captions are already visible/active
 */
function areCaptionsAlreadyActive(): boolean {
  // Check for caption container in DOM
  const captionSelectors = [
    '[aria-live="polite"]',
    '[aria-live="assertive"]',
    '[role="log"]',
    '[class*="caption" i]'
  ];

  for (const sel of captionSelectors) {
    try {
      const elements = document.querySelectorAll(sel);
      for (const el of elements) {
        if (!(el instanceof HTMLElement)) continue;
        try {
          const rect = el.getBoundingClientRect();
          // Check if the element is in the caption zone (lower part of screen)
          if (rect && rect.top > window.innerHeight * 0.4 &&
              rect.height > 10 && rect.width > 100) {
            const text = el.textContent?.trim() || '';
            // Accept: either has text (someone speaking) or is empty but exists in caption zone
            if (text.length > 3 || (rect.height > 20 && rect.height < 300)) {
              return true;
            }
          }
        } catch { /* skip */ }
      }
    } catch { /* skip */ }
  }

  // Also check if the CC button is in "active" state (aria-pressed or "turn off" label)
  const ccButton = findCCButton();
  if (ccButton) {
    const ariaPressed = ccButton.getAttribute('aria-pressed');
    const ariaLabel = (ccButton.getAttribute('aria-label') || '').toLowerCase();
    if (ariaPressed === 'true' ||
        ariaLabel.includes('desactivar') ||
        ariaLabel.includes('turn off') ||
        ariaLabel.includes('ocultar') ||
        ariaLabel.includes('hide')) {
      return true;
    }
  }

  return false;
}

/**
 * Find the CC/subtitles button in Google Meet toolbar
 * Uses multiple strategies to locate it
 */
function findCCButton(): HTMLElement | null {
  // Strategy 1: aria-label based selectors (most common)
  const ariaSelectors = [
    'button[aria-label*="subtítulo" i]',
    'button[aria-label*="subtitle" i]',
    'button[aria-label*="caption" i]',
    'button[aria-label*="Activar subtítulos" i]',
    'button[aria-label*="Turn on captions" i]',
    'button[aria-label*="Desactivar subtítulos" i]',
    'button[aria-label*="Turn off captions" i]',
    'button[aria-label*="subtítulos en vivo" i]',
    'button[aria-label*="live captions" i]',
    'button[aria-label*="closed caption" i]',
    'button[aria-label*="subtítulos automáticos" i]',
    'button[aria-label*="auto captions" i]',
  ];

  for (const sel of ariaSelectors) {
    try {
      const btn = document.querySelector(sel) as HTMLElement;
      if (btn) return btn;
    } catch { /* skip */ }
  }

  // Strategy 2: data-tooltip based (Google Meet uses tooltips)
  const tooltipSelectors = [
    'button[data-tooltip*="subtítulo" i]',
    'button[data-tooltip*="caption" i]',
    'button[data-tooltip*="subtitle" i]',
  ];

  for (const sel of tooltipSelectors) {
    try {
      const btn = document.querySelector(sel) as HTMLElement;
      if (btn) return btn;
    } catch { /* skip */ }
  }

  // Strategy 3: Look for the CC icon by its Material icon name or SVG content
  // Google Meet uses material icons - look for "closed_caption" icon
  const allButtons = document.querySelectorAll('button');
  for (const btn of allButtons) {
    try {
      const text = btn.textContent?.trim().toLowerCase() || '';
      // Material icon names
      if (text === 'closed_caption' || text === 'closed_caption_off' ||
          text === 'subtitles' || text === 'subtitles_off' ||
          text === 'cc' || text === 'closed_caption_disabled') {
        return btn as HTMLElement;
      }
      // Check for i/span with icon name inside button
      const iconEl = btn.querySelector('i, span.material-icons, span.google-material-icons, [class*="icon"]');
      if (iconEl) {
        const iconText = iconEl.textContent?.trim().toLowerCase() || '';
        if (iconText === 'closed_caption' || iconText === 'closed_caption_off' ||
            iconText === 'subtitles' || iconText === 'subtitles_off') {
          return btn as HTMLElement;
        }
      }
    } catch { /* skip */ }
  }

  // Strategy 4: Look in the bottom toolbar for buttons near typical CC position
  const toolbar = document.querySelector('[role="toolbar"]') ||
                  document.querySelector('[class*="toolbar" i]');
  if (toolbar) {
    const toolbarBtns = toolbar.querySelectorAll('button');
    for (const btn of toolbarBtns) {
      const label = (btn.getAttribute('aria-label') || '').toLowerCase();
      if (label.includes('cc') || label.includes('caption') ||
          label.includes('subtítulo') || label.includes('subtitle')) {
        return btn as HTMLElement;
      }
    }
  }

  return null;
}

/**
 * Enable closed captions by clicking the CC button
 * Returns true if captions are enabled or were already enabled, false otherwise
 *
 * Inspired by Tactiq's approach:
 * 1. Find the CC button using multiple strategies
 * 2. Check if already active
 * 3. Click to activate if not active
 * 4. Fallback: use keyboard shortcut (Ctrl+Shift+C)
 */
export function enableClosedCaptions(): boolean {
  // Check if settings dialog is open - close it first
  const settingsDialog = document.querySelector('[aria-modal="true"]');
  if (settingsDialog) {
    const closeBtn = settingsDialog.querySelector(
      'button[aria-label*="cerrar" i], button[aria-label*="close" i], button[aria-label*="Cerrar" i], button[aria-label*="Close" i]'
    ) as HTMLElement;
    if (closeBtn) {
      closeBtn.click();
      console.log('Soflia: Closed settings dialog');
    } else {
      const backdrop = document.querySelector('[data-backdrop="true"]') as HTMLElement;
      if (backdrop) backdrop.click();
    }
    // Don't return true yet - we need to actually check CC state after dialog closes
    return false;
  }

  // If captions are already active, don't click anything
  if (areCaptionsAlreadyActive()) {
    console.log('Soflia: Captions already active (detected in DOM)');
    return true;
  }

  // Find CC button using the robust finder
  const btn = findCCButton();

  if (btn) {
    const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
    const ariaPressed = btn.getAttribute('aria-pressed');

    // Check if already enabled
    if (ariaPressed === 'true') {
      console.log('Soflia: CC already enabled (aria-pressed=true)');
      return true;
    }

    if (ariaLabel.includes('desactivar') ||
        ariaLabel.includes('turn off') ||
        ariaLabel.includes('ocultar') ||
        ariaLabel.includes('hide')) {
      console.log('Soflia: CC already enabled (button says turn off/desactivar)');
      return true;
    }

    // If explicitly "off" state, click to enable
    if (ariaPressed === 'false' ||
        ariaLabel.includes('activar') ||
        ariaLabel.includes('turn on') ||
        ariaLabel.includes('habilitar') ||
        ariaLabel.includes('enable') ||
        ariaLabel.includes('mostrar') ||
        ariaLabel.includes('show')) {
      btn.click();
      console.log('Soflia: CC enabled via button click, label:', ariaLabel);
      return true;
    }

    // If button found but state is ambiguous (no "activar"/"desactivar" in label),
    // check aria-pressed. If not set, try clicking it.
    if (ariaPressed === null) {
      // Button exists but state unknown - click it and hope for the best
      btn.click();
      console.log('Soflia: CC button clicked (ambiguous state), label:', ariaLabel);
      return true;
    }
  }

  console.log('Soflia: CC button not found, will try keyboard shortcut');
  return false;
}

/**
 * Enable CC using keyboard shortcut as fallback
 * Google Meet shortcut: 'c' key toggles captions
 */
export function enableCCViaKeyboard(): void {
  try {
    // Google Meet uses 'c' as keyboard shortcut for toggling captions
    const meetVideo = document.querySelector('video') ||
                      document.querySelector('[data-meeting-code]') ||
                      document.body;

    const keyEvent = new KeyboardEvent('keydown', {
      key: 'c',
      code: 'KeyC',
      keyCode: 67,
      which: 67,
      bubbles: true,
      cancelable: true,
    });
    meetVideo.dispatchEvent(keyEvent);

    console.log('Soflia: Sent "c" keyboard shortcut to toggle CC');
  } catch (e) {
    console.error('Soflia: Error sending keyboard shortcut:', e);
  }
}

/**
 * Check if element is in the caption zone (bottom portion of screen)
 */
function isInCaptionZone(element: HTMLElement): boolean {
  try {
    const rect = element.getBoundingClientRect();
    // Captions appear in the lower 60% of the screen
    // Relaxed from 0.4 to 0.3 to account for side panels changing layout
    return rect.top > window.innerHeight * 0.3 &&
           rect.height > 15 && rect.height < 500 &&
           rect.width > 100;
  } catch {
    return false;
  }
}

/**
 * Check if element is a toolbar/controls area (NOT captions)
 */
function isToolbarElement(element: HTMLElement): boolean {
  const role = element.getAttribute('role');
  if (role === 'toolbar' || role === 'menubar' || role === 'navigation' ||
      role === 'menu' || role === 'tablist') return true;

  // Toolbars have many buttons
  const buttons = element.querySelectorAll('button, [role="button"]');
  if (buttons.length > 5) return true;

  return false;
}

/**
 * Find the caption container element
 * Uses multiple strategies from most specific to broadest
 */
export function findCaptionContainer(): HTMLElement | null {
  try {
    // ============================================================
    // STRATEGY 0: Google Meet specific selectors
    // Look for known Google Meet caption container patterns
    // ============================================================
    const meetCaptionSelectors = [
      // Google Meet uses these for caption overlays
      'div[class*="caption" i]:not([role="toolbar"])',
      'div[class*="subtitle" i]:not([role="toolbar"])',
      '[jsname][aria-live]',
      // Caption overlay near the bottom of the video area
      'div[jscontroller] > div[aria-live="polite"]',
      'div[jscontroller] > div[aria-live="assertive"]',
    ];

    for (const sel of meetCaptionSelectors) {
      try {
        const elements = document.querySelectorAll(sel);
        for (const el of elements) {
          if (!(el instanceof HTMLElement)) continue;
          if (!isInCaptionZone(el)) continue;
          if (isToolbarElement(el)) continue;
          console.log('Soflia: Found caption container via Meet-specific selector:', sel);
          return el;
        }
      } catch { /* skip invalid selectors */ }
    }

    // ============================================================
    // STRATEGY 1: aria-live regions (most standard for captions)
    // aria-live in the caption zone is a strong enough signal
    // even when the container is empty (nobody speaking yet)
    // ============================================================
    const liveRegions = document.querySelectorAll('[aria-live="polite"], [aria-live="assertive"]');
    for (const region of liveRegions) {
      if (!(region instanceof HTMLElement)) continue;
      if (!isInCaptionZone(region)) continue;
      if (isToolbarElement(region)) continue;

      // Accept: either has caption-like text OR is empty (waiting for speech)
      const text = region.textContent?.trim() || '';
      const hasText = text.length > 3 && text.includes(' ');
      const isEmpty = text.length === 0;

      if (hasText || isEmpty) {
        console.log('Soflia: Found caption container via aria-live', hasText ? '(with text)' : '(empty)');
        return region;
      }
    }

    // ============================================================
    // STRATEGY 2: role="region" or role="log" in caption zone
    // ============================================================
    const roleRegions = document.querySelectorAll('[role="region"], [role="log"], [role="status"]');
    for (const region of roleRegions) {
      if (!(region instanceof HTMLElement)) continue;
      if (!isInCaptionZone(region)) continue;
      if (isToolbarElement(region)) continue;

      const text = region.textContent?.trim() || '';
      // Accept with text (speech content) or empty (waiting for speech)
      if ((text.length > 10 && text.includes(' ')) || text.length === 0) {
        console.log('Soflia: Found caption container via role attribute');
        return region;
      }
    }

    // ============================================================
    // STRATEGY 3: Google Meet specific - look for caption overlay
    // Meet shows captions at the bottom of the video area with
    // speaker name + text. Look for positioned elements in the
    // bottom area that contain speech-like text.
    // ============================================================
    const allDivs = document.querySelectorAll('div');
    let bestCandidate: HTMLElement | null = null;
    let bestScore = 0;

    for (const div of allDivs) {
      if (!(div instanceof HTMLElement)) continue;

      try {
        const rect = div.getBoundingClientRect();

        // Must be in the lower 45% of the screen
        if (rect.top < window.innerHeight * 0.55) continue;

        // Must have reasonable caption size
        if (rect.height < 30 || rect.height > 400) continue;
        if (rect.width < 200) continue;

        // Must NOT be the bottom toolbar (which has many buttons)
        if (isToolbarElement(div)) continue;

        // Check positioning - caption overlays are typically absolute/fixed
        const style = window.getComputedStyle(div);
        const isPositioned = style.position === 'absolute' || style.position === 'fixed';

        // Get text content
        const text = div.textContent?.trim() || '';

        // Score this candidate
        let score = 0;

        // Positioned elements are more likely to be overlays
        if (isPositioned) score += 20;

        // Has aria-live on self or parent
        if (div.getAttribute('aria-live') ||
            div.parentElement?.getAttribute('aria-live')) score += 15;

        // Has background/backdrop (caption overlays have backgrounds)
        const bg = style.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') score += 10;

        // Lower on screen = more likely to be captions
        const normalizedTop = rect.top / window.innerHeight;
        if (normalizedTop > 0.7) score += 10;
        if (normalizedTop > 0.8) score += 5;

        // Text content looks like speech (bonus points, not required)
        if (text.length > 0 && text.includes(' ')) {
          const words = text.split(/\s+/).length;
          if (words > 3) score += 5;
          if (words > 8) score += 5;
        }

        // Fewer buttons = more likely captions (not toolbar)
        const btnCount = div.querySelectorAll('button').length;
        if (btnCount === 0) score += 10;
        else if (btnCount <= 2) score += 5;

        // Contains an image (speaker avatar)
        const hasImage = div.querySelector('img') !== null;
        if (hasImage) score += 5;

        if (score > bestScore) {
          bestScore = score;
          bestCandidate = div;
        }
      } catch { /* skip invalid elements */ }
    }

    if (bestCandidate && bestScore >= 15) {
      console.log('Soflia: Found caption container via heuristic scan, score:', bestScore);
      return bestCandidate;
    }

  } catch (e) {
    console.error('Soflia: Error finding caption container:', e);
  }

  return null;
}

/**
 * Hide the caption overlay visually while keeping it in the DOM
 *
 * CRITICAL: Only use clip-path and opacity to hide.
 * DO NOT change height, width, display, or visibility.
 * Google Meet may stop updating captions if the container dimensions change.
 * The element must remain fully "alive" in the layout for MutationObserver to work.
 */
export function hideCaptionsVisually(container: HTMLElement): void {
  try {
    // clip-path hides the visual rendering but keeps the element in layout
    container.style.setProperty('clip-path', 'inset(100%)', 'important');
    // opacity 0 as backup visual hiding
    container.style.setProperty('opacity', '0', 'important');
    // Don't let the invisible element intercept clicks
    container.style.setProperty('pointer-events', 'none', 'important');

    // DO NOT set height:0, width:0, display:none, or visibility:hidden
    // Those can cause Meet to stop updating the captions

    console.log('Soflia: Captions hidden visually (clip-path + opacity)');
  } catch (e) {
    console.error('Soflia: Error hiding captions:', e);
  }
}

/**
 * Get list of meeting participants
 */
export function getParticipants(): MeetParticipant[] {
  const participants: MeetParticipant[] = [];
  const seen = new Set<string>();

  try {
    // Method 1: Look for self-name in the bottom bar (your own name)
    const selfNameEl = document.querySelector('[data-self-name]');
    if (selfNameEl) {
      const selfName = selfNameEl.getAttribute('data-self-name');
      if (selfName && !seen.has('self')) {
        seen.add('self');
        participants.push({
          id: 'self',
          name: selfName.substring(0, 50),
          isSpeaking: false
        });
      }
    }

    // Method 2: Look for participant tiles with actual names
    const tiles = document.querySelectorAll('[data-participant-id]');
    tiles.forEach(tile => {
      try {
        if (!(tile instanceof HTMLElement)) return;

        const id = tile.getAttribute('data-participant-id') || '';
        if (seen.has(id)) return;

        // Get name ONLY from data attributes, not textContent (which includes UI elements)
        let name = tile.getAttribute('data-self-name') ||
                   tile.getAttribute('data-tooltip');

        // If no data attribute, try to find a dedicated name element
        if (!name) {
          const nameEl = tile.querySelector('[data-self-name]');
          name = nameEl?.getAttribute('data-self-name') || null;
        }

        // Skip if no valid name found
        if (!name || name.length < 2 || name.length > 50) return;

        // Skip if name looks like UI text
        if (isUIText(name)) return;

        seen.add(id);
        participants.push({ id, name, isSpeaking: detectSpeaking(tile) });
      } catch { /* skip */ }
    });

  } catch (e) {
    console.error('Soflia: Error getting participants:', e);
  }

  return participants;
}

/**
 * Check if text looks like UI element text (not a person's name)
 */
function isUIText(text: string): boolean {
  const uiPatterns = [
    /^(activar|desactivar|habilitar|deshabilitar)/i,
    /^(más|more|menos|less|cerrar|close)$/i,
    /^(micrófono|microphone|cámara|camera|video)/i,
    /^(fondos|backgrounds|efectos|effects|visual)/i,
    /^(compartir|share|presentar|present)/i,
    /^(reencuadrar|frame|person)/i,
    /^(chat|participantes|participants)/i,
    /^\d+$/,  // Just numbers
    /^[a-z_]+$/,  // lowercase_with_underscores (likely class names)
  ];

  for (const pattern of uiPatterns) {
    if (pattern.test(text.toLowerCase())) return true;
  }

  return false;
}

/**
 * Detect if an element (participant tile) is currently speaking
 */
function detectSpeaking(element: HTMLElement): boolean {
  try {
    if (!(element instanceof HTMLElement)) return false;

    // Method 1: data-is-speaking attribute
    if (element.getAttribute('data-is-speaking') === 'true') {
      return true;
    }

    // Method 2: Blue border (Google Meet's active speaker indicator)
    try {
      const style = window.getComputedStyle(element);
      const borderColor = style.borderColor || style.outlineColor || '';
      if (borderColor.includes('26, 115, 232') || // RGB blue
          borderColor.includes('1a73e8')) { // Hex blue
        return true;
      }

      // Method 4: Animation styles (speaking animation)
      const animation = style.animation || style.animationName || '';
      if (animation.toLowerCase().includes('speak') || animation.toLowerCase().includes('pulse')) {
        return true;
      }
    } catch { /* getComputedStyle may fail */ }

    // Method 3: Speaking class
    if (element.classList && (
        element.classList.contains('speaking') ||
        Array.from(element.classList).some(c => c.toLowerCase().includes('speaking')))) {
      return true;
    }
  } catch { /* element access failed */ }

  return false;
}

/**
 * Get the current active speaker
 */
export function getActiveSpeaker(): string | null {
  const participants = getParticipants();
  const speaker = participants.find(p => p.isSpeaking);
  return speaker?.name || null;
}

/**
 * Get full meeting info
 */
export function getMeetingInfo(): MeetingInfo {
  return {
    isActive: isMeetingActive(),
    url: window.location.href,
    title: getMeetingTitle(),
    participants: getParticipants(),
    activeSpeaker: getActiveSpeaker()
  };
}
