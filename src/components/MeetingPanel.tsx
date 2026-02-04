/**
 * Meeting Panel Component
 * Professional UI for meeting transcription, Lia interaction, and PDF export
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MeetingStatus, TranscriptSegmentLocal } from '../services/meeting-manager';
import { TranscriptSegment } from '../services/meeting-storage';
import { PDFExportService } from '../services/pdf-export';
import { getApiKeyWithCache } from '../services/api-keys';
import { GOOGLE_API_KEY } from '../config';

interface MeetingPanelProps {
  userId: string;
  onClose?: () => void;
}

type SummaryType = 'short' | 'detailed' | 'action_items' | 'executive';

// Styles object using CSS variables - MINIMALISTA
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: 'var(--bg-dark-main)',
    color: 'var(--color-white)',
    fontFamily: 'Inter, sans-serif',
  },
  // Combined header + status bar for minimal design
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    backgroundColor: 'var(--bg-dark-main)',
    gap: '8px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  },
  headerIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, var(--color-accent) 0%, #00a88e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    margin: 0,
    whiteSpace: 'nowrap' as const,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-gray-medium)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  // Status is now inline with header
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: 500,
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  platformBadge: {
    fontSize: '9px',
    fontWeight: 500,
    padding: '2px 6px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-dark-secondary)',
    color: 'var(--color-gray-medium)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  errorBanner: {
    margin: '8px 12px 0',
    padding: '8px 12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#fca5a5',
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  idleSection: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  detectButton: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'var(--bg-dark-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    color: 'var(--color-white)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  meetingCard: {
    padding: '12px',
    backgroundColor: 'var(--bg-dark-secondary)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  meetingCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
    animation: 'pulse 2s infinite',
  },
  meetingPlatform: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-white)',
  },
  meetingTitle: {
    fontSize: '11px',
    color: 'var(--color-gray-medium)',
    marginBottom: '10px',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  startButton: {
    width: '100%',
    padding: '10px 14px',
    background: 'linear-gradient(135deg, var(--color-accent) 0%, #00a88e 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#000',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(0, 212, 179, 0.25)',
    transition: 'all 0.2s ease',
  },
  noMeetingText: {
    textAlign: 'center' as const,
    color: 'var(--color-gray-medium)',
    fontSize: '12px',
    lineHeight: 1.5,
    padding: '12px 0',
  },
  controlsBar: {
    padding: '8px 12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--bg-dark-main)',
  },
  iconButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  liaButton: {
    flex: 1,
    padding: '10px 14px',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.25)',
    transition: 'all 0.2s ease',
  },
  transcriptContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '10px 12px',
  },
  transcriptSegment: {
    padding: '10px 12px',
    borderRadius: '8px',
    marginBottom: '6px',
    backgroundColor: 'var(--bg-dark-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
  },
  transcriptSegmentLia: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
  },
  segmentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  speakerName: {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  timestamp: {
    fontSize: '9px',
    color: 'var(--color-gray-medium)',
    fontWeight: 400,
  },
  segmentText: {
    fontSize: '12px',
    lineHeight: 1.5,
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-dark-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  emptyText: {
    fontSize: '12px',
    color: 'var(--color-gray-medium)',
    margin: 0,
  },
  endedSection: {
    padding: '12px',
    overflowY: 'auto' as const,
    flex: 1,
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-white)',
    marginBottom: '8px',
    marginTop: '12px',
  },
  summaryButtons: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  summaryButton: {
    padding: '8px 12px',
    backgroundColor: 'var(--bg-dark-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    color: 'var(--color-white)',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  summaryCard: {
    padding: '10px',
    backgroundColor: 'var(--bg-dark-secondary)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 212, 179, 0.15)',
    marginTop: '10px',
    maxHeight: '150px',
    overflowY: 'auto' as const,
  },
  summaryLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-accent)',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  summaryText: {
    fontSize: '12px',
    lineHeight: 1.5,
    color: 'rgba(255, 255, 255, 0.85)',
    whiteSpace: 'pre-wrap' as const,
    margin: 0,
  },
  exportButton: {
    width: '100%',
    padding: '10px 14px',
    background: 'linear-gradient(135deg, var(--color-accent) 0%, #00a88e 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '12px',
    boxShadow: '0 2px 8px rgba(0, 212, 179, 0.25)',
  },
  newMeetingButton: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'var(--bg-dark-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    color: 'var(--color-white)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '8px',
  },
  processingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    borderRadius: '6px',
    fontSize: '10px',
    color: '#fbbf24',
  },
  vadIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 500,
  },
  confidenceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    padding: '2px 5px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: 600,
    color: '#10b981',
  },
  speakerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
  },
};

// Status configurations with helpful descriptions
const statusConfig: Record<MeetingStatus | 'ready', { text: string; color: string; bgColor: string; description?: string }> = {
  idle: { text: 'Sin reunión', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.2)' },
  ready: { text: 'Listo para iniciar', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' },
  connecting: { text: 'Conectando...', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.2)', description: 'Selecciona la pestaña de la reunión en el diálogo' },
  transcribing: { text: 'Transcribiendo', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)', description: 'Capturando audio de la reunión' },
  lia_responding: { text: 'SOFLIA respondiendo', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.2)' },
  paused: { text: 'Pausado', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' },
  reconnecting: { text: 'Reconectando...', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.2)', description: 'Reestableciendo conexión con Live API' },
  error: { text: 'Error de conexión', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' },
  ended: { text: 'Finalizado', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' },
};

// Icons
const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const StopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const WaveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
    <path d="M2 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2v-8z" />
    <path d="M8 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8V8z" />
    <path d="M14 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2V4z" />
    <path d="M20 10h2v4h-2a2 2 0 0 1 0-4z" />
  </svg>
);

export const MeetingPanel: React.FC<MeetingPanelProps> = ({ userId: _userId, onClose }) => {
  // State
  const [status, setStatus] = useState<MeetingStatus>('idle');
  const [isDetectingMeeting, setIsDetectingMeeting] = useState(false);
  const [detectedMeeting, setDetectedMeeting] = useState<{
    platform: 'google-meet' | 'zoom' | null;
    title?: string;
    canCapture: boolean;
  } | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegmentLocal[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [error, setError] = useState<string>('');

  // UX enhancement states
  const [isProcessingAudio] = useState(false);
  const [vadActive, setVadActive] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  // Refs
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // ── Auto-captions (Tactiq-style): load buffered + listen live ──
  // Runs once on mount. If background has captions buffered while popup
  // was closed, populate transcript immediately. Then keep listening for
  // new CAPTION_RECEIVED messages so captions keep flowing in real-time.
  useEffect(() => {
    let segCounter = 0;
    const startTime = Date.now();

    // 1. Load buffered captions from background
    chrome.runtime.sendMessage({ type: 'GET_AUTO_MEETING_STATE' }, (state: any) => {
      if (chrome.runtime.lastError || !state?.captions?.length) return;
      console.log('MeetingPanel: Loading', state.captions.length, 'buffered CC captions');

      const buffered: TranscriptSegmentLocal[] = state.captions.map((c: any) => ({
        id: `cc_${++segCounter}_${c.timestamp}`,
        timestamp: c.timestamp,
        relativeTimeMs: c.timestamp - startTime,
        speaker: c.speaker || 'Participante',
        text: c.text,
        isLiaResponse: false,
        isLiaInvocation: (c.text || '').toLowerCase().includes('lia'),
      }));

      setTranscript(buffered);
      setStatus('transcribing');
      setVadActive(true);

      // Update detected-meeting info so the UI shows the right platform
      if (state.platform) {
        setDetectedMeeting({
          platform: state.platform === 'google-meet' ? 'google-meet' : 'zoom',
          title: state.title,
          canCapture: true,
        });
      }
    });

    // 2. Listen for live captions (arrive while popup is open)
    const liveCaptionListener = (message: any) => {
      if (message?.type !== 'CAPTION_RECEIVED') return;
      if (!message.text?.trim()) return;

      setTranscript((prev) => {
        // Dedup: skip if the last segment has the same text
        if (prev.length > 0 && prev[prev.length - 1].text === message.text.trim()) return prev;
        return [
          ...prev,
          {
            id: `cc_${++segCounter}_${Date.now()}`,
            timestamp: message.timestamp || Date.now(),
            relativeTimeMs: (message.timestamp || Date.now()) - startTime,
            speaker: message.speaker || 'Participante',
            text: message.text.trim(),
            isLiaResponse: false,
            isLiaInvocation: message.text.toLowerCase().includes('lia'),
          },
        ];
      });

      // Make sure we're in transcribing state
      setStatus((prev) => (prev === 'idle' ? 'transcribing' : prev));
      setVadActive(true);
      if (message.speaker) setCurrentSpeaker(message.speaker);
    };

    chrome.runtime.onMessage.addListener(liveCaptionListener);

    return () => {
      chrome.runtime.onMessage.removeListener(liveCaptionListener);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper to inject content script if not loaded
  const ensureContentScript = async (tabId: number): Promise<boolean> => {
    try {
      // Try to ping the content script
      const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      return response?.pong === true;
    } catch {
      // Content script not loaded, inject it
      console.log('Content script not loaded, injecting...');
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['assets/content.js'],
        });
        // Wait a bit for the script to initialize
        await new Promise((resolve) => setTimeout(resolve, 300));
        return true;
      } catch (injectErr) {
        console.error('Failed to inject content script:', injectErr);
        return false;
      }
    }
  };

  // Detect meeting on mount
  const detectMeeting = useCallback(async () => {
    setIsDetectingMeeting(true);
    setError('');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id) {
        setDetectedMeeting(null);
        return;
      }

      // Ensure content script is loaded
      const scriptReady = await ensureContentScript(tab.id);
      if (!scriptReady) {
        setError('No se pudo cargar el script en la página');
        setDetectedMeeting(null);
        return;
      }

      // Now try to detect meeting
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'canCaptureMeeting' });

      if (response) {
        setDetectedMeeting({
          platform: response.meetingInfo?.platform || null,
          title: response.meetingInfo?.title,
          canCapture: response.canCapture || false,
        });
      } else {
        setDetectedMeeting(null);
      }
    } catch (err) {
      console.error('Error detecting meeting:', err);
      setError('Error al detectar reunión. Intenta recargar la página.');
      setDetectedMeeting(null);
    } finally {
      setIsDetectingMeeting(false);
    }
  }, []);

  useEffect(() => {
    detectMeeting();
  }, [detectMeeting]);

  // Generate summary
  const generateSummary = async (type: SummaryType) => {
    if (transcript.length === 0) {
      setError('No hay transcripción para resumir');
      return;
    }

    setIsGeneratingSummary(true);
    setError('');

    try {
      const transcriptText = transcript
        .map((s) => {
          const time = new Date(s.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          const speaker = s.isLiaResponse ? 'SOFLIA' : (s.speaker || 'Participante');
          return `[${time}] ${speaker}: ${s.text}`;
        })
        .join('\n');

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      let apiKey = await getApiKeyWithCache('google');
      if (!apiKey) {
        apiKey = GOOGLE_API_KEY;
      }
      if (!apiKey) {
        throw new Error('No API key configured');
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const result = await model.generateContent(`Resume esta reunión (${type}):\n\n${transcriptText}`);
      setSummary(result.response.text());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar resumen');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Export to PDF
  const exportPDF = async () => {
    if (transcript.length === 0) {
      setError('No hay transcripción para exportar');
      return;
    }

    try {
      const pdfService = new PDFExportService('es');
      const now = new Date();

      // Build a minimal session object for the PDF generator
      const sessionForPdf = {
        id: `local_${Date.now()}`,
        platform: detectedMeeting?.platform || 'google-meet',
        title: detectedMeeting?.title || 'Reunión',
        start_time: new Date(transcript[0].timestamp).toISOString(),
        end_time: now.toISOString(),
        summary: summary || null,
      };

      const fullTranscript: TranscriptSegment[] = transcript.map((s) => ({
        id: s.id,
        session_id: sessionForPdf.id,
        timestamp: new Date(s.timestamp).toISOString(),
        relative_time_ms: s.relativeTimeMs,
        speaker: s.isLiaResponse ? 'SOFLIA' : (s.speaker || null),
        text: s.text,
        is_lia_response: s.isLiaResponse,
        is_lia_invocation: s.isLiaInvocation,
        language: 'es',
        confidence: null as number | null,
        created_at: new Date().toISOString(),
      }));

      const blob = await pdfService.generateMeetingPDF(
        {
          session: sessionForPdf as any,
          transcript: fullTranscript,
        },
        {
          includeTranscript: true,
          includeSummary: !!summary,
          includeActionItems: false,
          language: 'es',
        }
      );

      PDFExportService.downloadPDF(blob, PDFExportService.generateFilename(sessionForPdf as any));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar PDF');
    }
  };

  // Show "ready" status when meeting is detected but not started
  const displayStatus = status === 'idle' && detectedMeeting?.platform ? 'ready' : status;
  const currentStatus = statusConfig[displayStatus];
  const isActive = status === 'transcribing' || status === 'lia_responding' || status === 'paused';

  return (
    <div style={styles.container}>
      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Compact Header - Integrates title + status inline */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <div style={styles.headerIcon}>
            <VideoIcon />
          </div>
          <span style={styles.title}>Reuniones</span>
          
          {/* Status inline */}
          <div style={styles.statusIndicator}>
            <div
              style={{
                ...styles.statusDot,
                backgroundColor: currentStatus.color,
                boxShadow: `0 0 0 2px ${currentStatus.bgColor}`,
                animation: (status === 'transcribing' || status === 'reconnecting' || status === 'connecting') ? 'pulse 1.5s infinite' : 'none',
              }}
            />
            <span className="hide-text-on-compact" style={{ color: currentStatus.color }}>{currentStatus.text}</span>
          </div>
          
          {/* Platform badge inline */}
          {detectedMeeting?.platform && <span className="hide-text-on-compact" style={styles.platformBadge}>{detectedMeeting.platform === 'google-meet' ? 'MEET' : 'ZOOM'}</span>}
        </div>
        
        {onClose && (
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {/* Enhanced UX Indicators */}
      {status === 'transcribing' && (
        <div style={{ padding: '6px 12px', backgroundColor: 'var(--bg-dark-main)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* VAD Indicator */}
          {vadActive && (
            <div style={{
              ...styles.vadIndicator,
              borderColor: vadActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.2)',
              backgroundColor: vadActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(107, 114, 128, 0.08)',
            }}>
              <div style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: vadActive ? '#10b981' : '#6b7280',
                animation: vadActive ? 'pulse 1.5s infinite' : 'none',
              }} />
              <span style={{ color: vadActive ? '#10b981' : '#6b7280' }}>
                Voz
              </span>
            </div>
          )}

          {/* Current Speaker - more compact */}
          {currentSpeaker && (
            <div style={{
              ...styles.vadIndicator,
              borderColor: 'rgba(0, 212, 179, 0.3)',
              backgroundColor: 'rgba(0, 212, 179, 0.08)',
            }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
                {currentSpeaker}
              </span>
            </div>
          )}

          {/* Processing - compact */}
          {isProcessingAudio && (
            <div style={styles.processingIndicator}>
              <div style={{
                width: '8px',
                height: '8px',
                border: '1.5px solid #fbbf24',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span>Procesando...</span>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={styles.errorBanner}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            <span>{error}</span>
            {status === 'error' && (
              <button
                onClick={() => {
                  setError('');
                  setStatus('idle');
                  detectMeeting();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '6px',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginTop: '4px',
                  width: 'fit-content',
                }}
              >
                Reintentar
              </button>
            )}
          </div>
          <button
            onClick={() => setError('')}
            style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: '4px' }}
          >
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Idle State - Detection */}
        {status === 'idle' && (
          <div style={styles.idleSection}>
            <button
              style={styles.detectButton}
              onClick={detectMeeting}
              disabled={isDetectingMeeting}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
            >
              {isDetectingMeeting ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--color-accent)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Detectando...
                </>
              ) : (
                <>
                  <SearchIcon />
                  Detectar Reunión
                </>
              )}
            </button>

            {detectedMeeting && (
              <div style={styles.meetingCard}>
                {detectedMeeting.platform ? (
                  <>
                    <div style={styles.meetingCardHeader}>
                      <div style={styles.liveDot} />
                      <span style={styles.meetingPlatform}>
                        {detectedMeeting.platform === 'google-meet' ? 'Google Meet' : 'Zoom'} detectado
                      </span>
                    </div>
                    {detectedMeeting.title && <p style={styles.meetingTitle}>{detectedMeeting.title}</p>}
                    <p style={{ ...styles.noMeetingText, color: 'var(--color-accent)', fontSize: '12px' }}>
                      Transcripción automática activa — habla en la reunión para ver el texto aquí.
                    </p>
                  </>
                ) : (
                  <p style={styles.noMeetingText}>
                    No se detectó ninguna reunión activa.
                    <br />
                    Abre Google Meet o Zoom para comenzar.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Active Meeting Controls — CC auto-mode only */}
        {isActive && (
          <div style={styles.controlsBar}>
            <button
              style={{
                ...styles.iconButton,
                backgroundColor: '#ef4444',
                color: '#fff',
              }}
              onClick={() => { setStatus('ended'); setVadActive(false); setCurrentSpeaker(null); }}
              title="Detener transcripción"
            >
              <StopIcon />
            </button>
          </div>
        )}

        {/* Transcript View */}
        {transcript.length > 0 && (
          <div style={styles.transcriptContainer}>
            {transcript.map((segment) => (
              <div
                key={segment.id}
                style={{
                  ...styles.transcriptSegment,
                  ...(segment.isLiaResponse ? styles.transcriptSegmentLia : {}),
                }}
              >
                <div style={styles.segmentHeader}>
                  <span
                    style={{
                      ...styles.speakerName,
                      color: segment.isLiaResponse ? '#a78bfa' : 'var(--color-accent)',
                    }}
                  >
                    {segment.isLiaResponse ? 'SOFLIA' : (segment.speaker || 'Participante')}
                  </span>
                  <span style={styles.timestamp}>
                    {new Date(segment.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={styles.segmentText}>{segment.text}</p>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        )}

        {/* Empty State while transcribing */}
        {isActive && transcript.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <WaveIcon />
            </div>
            <p style={styles.emptyText}>Esperando audio...</p>
            <p style={{ ...styles.emptyText, fontSize: '12px', marginTop: '12px', maxWidth: '260px', lineHeight: '1.5' }}>
              <strong>Tip:</strong> Si no ves transcripción después de unos segundos, verifica que hayas compartido la pestaña correcta (Google Meet o Zoom) y que esté marcada la opción "Compartir audio".
            </p>
          </div>
        )}

        {/* Session Ended - Summary & Export */}
        {status === 'ended' && (
          <div style={styles.endedSection}>
            <h3 style={{ ...styles.sectionTitle, marginTop: 0 }}>Generar Resumen</h3>
            <div style={styles.summaryButtons}>
              {(['short', 'detailed', 'action_items', 'executive'] as SummaryType[]).map((type) => (
                <button
                  key={type}
                  style={{
                    ...styles.summaryButton,
                    opacity: isGeneratingSummary ? 0.6 : 1,
                    cursor: isGeneratingSummary ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => generateSummary(type)}
                  disabled={isGeneratingSummary}
                  onMouseEnter={(e) => {
                    if (!isGeneratingSummary) e.currentTarget.style.borderColor = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
                >
                  {type === 'short' && 'Corto'}
                  {type === 'detailed' && 'Detallado'}
                  {type === 'action_items' && 'Acciones'}
                  {type === 'executive' && 'Ejecutivo'}
                </button>
              ))}
            </div>

            {summary && (
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Resumen</div>
                <p style={styles.summaryText}>{summary}</p>
              </div>
            )}

            <button style={styles.exportButton} onClick={exportPDF}>
              <DownloadIcon />
              Exportar PDF
            </button>

            <button
              style={styles.newMeetingButton}
              onClick={() => {
                setStatus('idle');
                setTranscript([]);
                setSummary('');
                detectMeeting();
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
            >
              Nueva Reunión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingPanel;
