/**
 * MeetCaptionScraper - Scrapes Google Meet's built-in CC (Closed Captions)
 *
 * Same approach as Tactiq: reads the caption text directly from the DOM.
 * Requires the user to enable CC in Google Meet (click the CC button).
 *
 * Benefits over audio-based transcription:
 * - Speaker names come from Google's own system (no guessing)
 * - Real-time: text appears as it's spoken, no buffering
 * - Zero hallucinations: text is from Google's own speech engine
 * - No Gemini API calls needed for transcription
 *
 * Usage:
 *   const scraper = new MeetCaptionScraper();
 *   scraper.start((entry) => console.log(entry.speaker, entry.text));
 */

export interface CaptionEntry {
  speaker: string;
  text: string;
  timestamp: number;
}

export class MeetCaptionScraper {
  private observer: MutationObserver | null = null;
  private onCaption: ((entry: CaptionEntry) => void) | null = null;
  private isRunning = false;
  private lastEmittedText = '';
  private captionRoot: Element | null = null;
  private scanInterval: ReturnType<typeof setInterval> | null = null;
  // Track consecutive system-message-only extractions; if too many, reset captionRoot
  private consecutiveSystemMessages = 0;

  // --- Selectors tried in order. Google changes class names; we try multiple. ---
  // Container: the div that holds all caption blocks
  private static readonly CONTAINER_SELECTORS = [
    'div[jscontroller="TEjq6e"]',          // Meet caption container (seen in 2024-2025)
    'div[jscontroller="mbtgMb"]',          // Alternative jscontroller seen in 2025
    'div[jscontroller="r4E1ne"]',          // Another observed variant
    '[aria-live="polite"][role="status"]',  // Accessible live + status
    '[aria-live="polite"]',                 // Generic live region
    '[aria-live="assertive"]',
  ];

  // Google Meet system notification patterns (ES + EN).
  // These are NOT speech — they are internal Meet status messages.
  private static readonly SYSTEM_PATTERNS: RegExp[] = [
    /te uniste/i,
    /you joined/i,
    /se fue de la llamada/i,
    /left the (call|meeting)/i,
    /se unió a la llamada/i,
    /joined the (call|meeting)/i,
    /cámara está (de)?activad/i,
    /camera is (off|on)/i,
    /micrófono está (de)?activad/i,
    /mic(rophone)? is (off|on|muted)/i,
    /mano levantad/i,
    /hand (is |is not )?raised/i,
    /llegaste antes/i,
    /you arrived before/i,
    /reunión no está guardada/i,
    /meeting is not being recorded/i,
    /está compartiendo/i,
    /you('re| are) sharing/i,
    /organizador/i,
    /organizer/i,
    /no tienes la mano/i,
    /esta reunión/i,
    /esta llamada/i,
    /presentación en pantalla/i,
    /screen shar/i,
    /you are the only one/i,
    /eres el único/i,
    /estás solo/i,
    /solo en esta llamada/i,
  ];

  /** Returns true if the text looks like a Meet system notification, not speech. */
  static isSystemMessage(text: string): boolean {
    return MeetCaptionScraper.SYSTEM_PATTERNS.some(p => p.test(text));
  }

  // Speaker name element (inside caption block)
  private static readonly SPEAKER_SELECTORS = [
    '.zs7s8d.jxFHg',
    '.zs7s8d',
    '[data-speaker-name]',
  ];

  // Caption text element (inside caption block)
  private static readonly TEXT_SELECTORS = [
    '.CNusmb',
    '.iTTPOb',
  ];

  // ---- public API ----

  start(onCaption: (entry: CaptionEntry) => void): void {
    if (this.isRunning) return;
    this.onCaption = onCaption;
    this.isRunning = true;
    this.lastEmittedText = '';

    // Try to find the container right away
    this.captionRoot = this.findContainer();
    if (this.captionRoot) {
      console.log('MeetCaptionScraper: Caption container found on start');
    } else {
      console.log('MeetCaptionScraper: Caption container not found yet — user may need to enable CC (click the CC button in Meet)');
    }

    // Observe all DOM mutations; re-check container + extract captions
    this.observer = new MutationObserver(() => {
      if (!this.captionRoot) {
        this.captionRoot = this.findContainer();
        if (this.captionRoot) {
          console.log('MeetCaptionScraper: Caption container appeared');
        }
      }
      if (this.captionRoot) this.extract();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Periodic fallback scan (1 s) — MutationObserver can miss some updates
    this.scanInterval = setInterval(() => {
      if (!this.captionRoot) {
        this.captionRoot = this.findContainer();
        if (this.captionRoot) {
          console.log('MeetCaptionScraper: Caption container found via periodic scan');
        }
      }
      if (this.captionRoot) this.extract();
    }, 1000);

    console.log('MeetCaptionScraper: Started');
  }

  stop(): void {
    if (this.observer) { this.observer.disconnect(); this.observer = null; }
    if (this.scanInterval) { clearInterval(this.scanInterval); this.scanInterval = null; }
    this.isRunning = false;
    this.captionRoot = null;
    this.lastEmittedText = '';
    console.log('MeetCaptionScraper: Stopped');
  }

  /** Returns true once a caption container has been located in the DOM. */
  isCaptionsDetected(): boolean {
    return this.captionRoot !== null;
  }

  /** Returns the caption root element (so caller can hide it visually). */
  getCaptionRoot(): Element | null {
    return this.captionRoot;
  }

  // ---- private helpers ----

  /**
   * Try every known selector for the caption container.
   * Falls back to heuristic: look for aria-live regions in the lower half of the viewport.
   */
  private findContainer(): Element | null {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // ── Strategy 1: known attribute selectors (fast path) ──
    for (const sel of MeetCaptionScraper.CONTAINER_SELECTORS) {
      try {
        for (const el of document.querySelectorAll(sel)) {
          const text = el.textContent?.trim();
          if (text && !MeetCaptionScraper.isSystemMessage(text)) return el;
        }
      } catch { /* invalid selector */ }
    }

    // ── Strategy 2: role="log" (Meet uses this in some versions) ──
    try {
      for (const el of document.querySelectorAll('[role="log"]')) {
        const text = el.textContent?.trim();
        if (text && !MeetCaptionScraper.isSystemMessage(text)) {
          console.log('MeetCaptionScraper: Found via role="log"');
          return el;
        }
      }
    } catch { /* skip */ }

    // ── Strategy 3: elementsFromPoint — probe where CC captions visually render ──
    // Google Meet draws the caption overlay near the bottom of the video grid,
    // above the toolbar.  Probe a grid of (x, y) positions and walk the hit-test
    // stack from outer → inner to find the tightest container that is neither
    // a single text line nor the whole page.
    try {
      const yFracs = [0.75, 0.70, 0.80, 0.65, 0.60, 0.85];
      const xFracs = [0.50, 0.35, 0.65];

      for (const yf of yFracs) {
        for (const xf of xFracs) {
          const stack = document.elementsFromPoint(vw * xf, vh * yf);
          // Walk outer → inner: stack order is [innermost … outermost]
          for (let i = stack.length - 1; i >= 0; i--) {
            const el = stack[i];
            if (!(el instanceof HTMLElement)) continue;
            if (el === document.body || el === document.documentElement) continue;
            const text = el.textContent?.trim();
            if (!text || text.length < 5) continue;
            if (MeetCaptionScraper.isSystemMessage(text)) continue;
            const rect = el.getBoundingClientRect();
            // Caption overlay: meaningful height (>25 px), not the full page (<45 % vh), decent width
            if (rect.height < 25 || rect.height > vh * 0.45) continue;
            if (rect.width < vw * 0.15) continue;
            console.log('MeetCaptionScraper: Found via elementsFromPoint y=' + Math.round(vh * yf));
            return el;
          }
        }
      }
    } catch { /* skip */ }

    // ── Strategy 4: aria-live fallback (lower viewport, non-system text) ──
    try {
      for (const el of document.querySelectorAll('[aria-live]')) {
        const rect = el.getBoundingClientRect();
        const text = el.textContent?.trim();
        if (rect.width > 150 && rect.top > vh * 0.25 && text && !MeetCaptionScraper.isSystemMessage(text)) {
          console.log('MeetCaptionScraper: Found via aria-live heuristic');
          return el;
        }
      }
    } catch { /* skip */ }

    return null;
  }

  /**
   * Extract the most-recent caption text + speaker from the container.
   * Only fires the callback when the text has actually changed.
   */
  private extract(): void {
    if (!this.captionRoot || !this.onCaption) return;

    const { speaker, text } = this.readSpeakerAndText(this.captionRoot);
    if (!text || text === this.lastEmittedText) return;

    // Drop Google Meet system notifications (not speech)
    if (MeetCaptionScraper.isSystemMessage(text)) {
      this.consecutiveSystemMessages++;
      // After 3 system-only extractions the locked container is wrong — reset so we search again
      if (this.consecutiveSystemMessages >= 3) {
        console.log('MeetCaptionScraper: Container only produces system messages — resetting to find real CC container');
        this.captionRoot = null;
        this.consecutiveSystemMessages = 0;
        this.lastEmittedText = '';
      }
      return;
    }

    this.consecutiveSystemMessages = 0;
    this.lastEmittedText = text;
    console.log('MeetCaptionScraper: Caption detected —', speaker, ':', text);
    this.onCaption({ speaker, text, timestamp: Date.now() });
  }

  /**
   * Two-pass extraction:
   * 1. Try known class selectors for speaker + caption text elements.
   * 2. Fall back to parsing the raw textContent of the container.
   */
  private readSpeakerAndText(root: Element): { speaker: string; text: string } {
    // --- Pass 1: structured selectors ---
    let speaker: string | null = null;
    for (const sel of MeetCaptionScraper.SPEAKER_SELECTORS) {
      try {
        const els = root.querySelectorAll(sel);
        // Use the LAST speaker element (most recent block)
        if (els.length > 0) {
          const last = els[els.length - 1];
          const name = last.textContent?.trim();
          if (name && name.length > 0 && name.length < 80) { speaker = name; break; }
        }
      } catch { /* skip */ }
    }

    let text: string | null = null;
    for (const sel of MeetCaptionScraper.TEXT_SELECTORS) {
      try {
        const els = root.querySelectorAll(sel);
        if (els.length > 0) {
          // Concatenate all caption spans (they may be split across elements)
          text = Array.from(els).map(el => el.textContent?.trim() || '').join(' ').trim();
          if (text) break;
        }
      } catch { /* skip */ }
    }

    if (speaker && text) return { speaker, text };

    // --- Pass 2: parse from raw textContent ---
    return this.parseFromText(root.textContent?.trim() || '');
  }

  /**
   * Parse speaker + text from the raw textContent string.
   *
   * Google Meet renders captions roughly as:
   *   "SpeakerName\nCaption line 1\nCaption line 2\nSpeakerName2\n..."
   *
   * We scan backwards to find the last line that looks like a name,
   * then take everything after it as the caption text.
   */
  private parseFromText(raw: string): { speaker: string; text: string } {
    const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return { speaker: 'Participante', text: '' };

    // Scan backwards for a name-like line
    for (let i = lines.length - 1; i >= 0; i--) {
      if (this.looksLikeName(lines[i])) {
        const captionText = lines.slice(i + 1).join(' ');
        // If there's text after the name, use it; otherwise the name might actually be text
        if (captionText.length > 0) {
          return { speaker: lines[i], text: captionText };
        }
      }
    }

    // No name found — return all text, speaker unknown
    return { speaker: 'Participante', text: lines.join(' ') };
  }

  /**
   * Heuristic: does this line look like a person's name rather than spoken text?
   *
   * Names are typically:
   *   - Short (< 60 chars)
   *   - Do NOT end in sentence-ending punctuation (.?!)
   *   - Do NOT start with common sentence-starter words
   */
  private looksLikeName(line: string): boolean {
    if (line.length < 2 || line.length > 60) return false;
    if (/[.?!]$/.test(line)) return false;

    const sentenceStarts = /^(Hola|Gracias|Sí|Si|No|Bien|Bueno|Es|El|La|Los|Las|Un|Una|De|En|Con|Para|Por|Que|Esto|Todo|Muy|Yes|Hello|The|And|But|So|I |We |He |She |They|OK|Okay|Wait|Hmm|Eh|Uh|Bueno|Creo|Pues|Claro|Vamos|Entonces|Quiero|Necesit)/i;
    if (sentenceStarts.test(line)) return false;

    return true;
  }
}

export default MeetCaptionScraper;
