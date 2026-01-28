import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { LiveClient } from '../services/live-api';
import ReactMarkdown from 'react-markdown';

interface GroundingSource {
  uri: string;
  title: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  reactions?: string[];
  images?: string[];
  sources?: GroundingSource[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Live API States
  const [isLiveActive, setIsLiveActive] = useState(false);
  const liveClientRef = useRef<LiveClient | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Plus Menu States
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [isImageGenMode, setIsImageGenMode] = useState(false);
  
  // Settings Menu States
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    // Load theme from localStorage or default to 'dark'
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lia_theme') as 'light' | 'dark' | 'system') || 'dark';
    }
    return 'dark';
  });

  // Image Zoom State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Apply Theme & Persist
  useLayoutEffect(() => {
    localStorage.setItem('lia_theme', theme);
    const root = document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Avatar URL for extension
  const liaAvatar = chrome.runtime.getURL('assets/lia-avatar.png');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  // Context from selected text (shown as attachment, not auto-sent)
  const [selectedContext, setSelectedContext] = useState<{ text: string; action: string } | null>(null);
  
  // Function to check for pending selection
  const checkPendingSelection = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_PENDING_SELECTION' });
      console.log('Checking pending selection:', response);
      if (response && response.text) {
        console.log('Found pending context:', response.text.substring(0, 50));
        // Set as context, don't auto-send
        setSelectedContext({
          text: response.text,
          action: response.action
        });
      }
    } catch (err) {
      console.log('No pending selection:', err);
    }
  };
  
  useEffect(() => {
    // Check immediately
    checkPendingSelection();
    
    // Also check when panel becomes visible (for when it was already open)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkPendingSelection();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for messages from background
    const handleMessage = (message: any) => {
      if (message.type === 'PENDING_SELECTION_AVAILABLE') {
        checkPendingSelection();
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);
  
  // Clear context helper
  const clearSelectedContext = () => {
    setSelectedContext(null);
  };

  // Voice Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // TODO: Send to speech-to-text API
        console.log('Audio recorded:', audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setSelectedImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Copy to Clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Reactions
  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        if (reactions.includes(emoji)) {
          return { ...msg, reactions: reactions.filter(r => r !== emoji) };
        }
        return { ...msg, reactions: [...reactions, emoji] };
      }
      return msg;
    }));
  };

  const handleLiveToggle = async () => {
    if (isLiveActive) {
      stopLiveSession();
    } else {
      await startLiveSession();
    }
  };

  const startLiveSession = async () => {
    try {
      if (!liveClientRef.current) {
        liveClientRef.current = new LiveClient(
          (data) => {
            if (data.serverContent?.modelTurn?.parts) {
              const text = data.serverContent.modelTurn.parts.find((p: any) => p.text)?.text;
              if (text) {
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  role: 'model',
                  text: text,
                  timestamp: Date.now()
                }]);
              }
            }
          },
          (error) => {
            console.error("Live Client Error", error);
            stopLiveSession();
          },
          () => {
            setIsLiveActive(false);
          }
        );
      }

      await liveClientRef.current.connect();
      setIsLiveActive(true);
    } catch (e) {
      console.error("Failed to start live session", e);
    }
  };

  const stopLiveSession = () => {
    if (liveClientRef.current) {
      liveClientRef.current.disconnect();
    }
    setIsLiveActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleSendMessage = async (text: string = inputValue) => {
    // Build messages - separate display from API
    let displayMessage = text.trim(); // What user sees in chat
    let apiMessage = text.trim(); // What gets sent to API
    
    if (selectedContext) {
      // Context goes to API but NOT displayed in chat
      const contextForAPI = `[CONTEXTO - Texto seleccionado de la página que el usuario quiere que analices]:\n"${selectedContext.text}"\n\n[INSTRUCCIÓN DEL USUARIO]:`;
      
      if (displayMessage) {
        // User typed something - that's what we show
        apiMessage = contextForAPI + '\n' + displayMessage;
      } else {
        // No user input, use default based on action
        switch (selectedContext.action) {
          case 'ask':
            displayMessage = 'Tengo una pregunta sobre el texto señalado';
            break;
          case 'explain':
            displayMessage = 'Explícame el texto señalado';
            break;
          case 'summarize':
            displayMessage = 'Resume el texto señalado';
            break;
          case 'translate':
            displayMessage = 'Traduce el texto señalado al inglés';
            break;
          default:
            displayMessage = 'Analiza el texto señalado';
        }
        apiMessage = contextForAPI + '\n' + displayMessage;
      }
      // Clear context after using it
      setSelectedContext(null);
    }
    
    if (!displayMessage && selectedImages.length === 0) return;

    if (isLiveActive && liveClientRef.current) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: displayMessage,
        timestamp: Date.now(),
        images: selectedImages.length > 0 ? [...selectedImages] : undefined
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setSelectedImages([]);

      liveClientRef.current.send({
        clientContent: {
          turns: [{
            role: "user",
            parts: [{ text: apiMessage }]
          }],
          turnComplete: true
        }
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: displayMessage,
      timestamp: Date.now(),
      images: selectedImages.length > 0 ? [...selectedImages] : undefined
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSelectedImages([]);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    try {
      let pageContext = '';

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab?.url?.startsWith('chrome://') || tab?.url?.startsWith('edge://') || tab?.url?.startsWith('about:')) {
          pageContext = '[ERROR: Esta es una página protegida del navegador. Lia no puede acceder al contenido de páginas chrome://, edge:// o about:. Por favor navega a una página web normal para que pueda analizarla.]';
        } else if (tab?.id) {
          const response = await chrome.tabs.sendMessage(tab.id, { action: "getStructuredDOM" });
          if (response?.dom) {
            pageContext = JSON.stringify(response.dom, null, 2);
          } else {
            pageContext = '[INFO: No se pudo obtener información de la página. Puede que el content script no esté cargado. Intenta recargar la página.]';
          }
        }
      } catch (err) {
        console.log('No se pudo obtener el contexto de la página:', err);
        pageContext = '[ERROR: No se pudo conectar con el content script. Esto puede ocurrir en páginas protegidas o si necesitas recargar la página después de instalar la extensión.]';
      }

      // If in Image Generation mode, use image generation flow
      if (isImageGenMode) {
        try {
          const { generateImage } = await import('../services/gemini');
          const result = await generateImage(apiMessage);
          
          setMessages((prev) =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { 
                    ...msg, 
                    text: result.text,
                    images: result.imageData ? [result.imageData] : undefined
                  }
                : msg
            )
          );
        } catch (error) {
          console.error('Image generation error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          setMessages((prev) =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: `Error generando imagen: ${errorMessage}` }
                : msg
            )
          );
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // If in Deep Research mode
      if (isDeepResearch) {
        try {
          const { runDeepResearch } = await import('../services/gemini');
          const result = await runDeepResearch(apiMessage);
          
          let fullText = '';
          
          for await (const chunk of result.stream) {
            let chunkText = '';
            try {
              chunkText = chunk.text();
            } catch (e) {
              // Might be a function call only, ignore text error
            }
            
            fullText += chunkText;

            // Check for function calls (e.g. Navigation)
            const functionCalls = chunk.functionCalls ? chunk.functionCalls() : [];
            if (functionCalls) {
              for (const call of functionCalls) {
                if (call.name === 'open_url') {
                  const url = (call.args as any).url as string;
                  if (url) {
                    if (window.chrome && chrome.tabs && chrome.tabs.create) {
                      chrome.tabs.create({ url });
                    } else {
                      window.open(url, '_blank');
                    }
                  }
                }
              }
            }

            setMessages((prev) =>
              prev.map(msg =>
                msg.id === aiMessageId
                  ? { ...msg, text: fullText }
                  : msg
              )
            );
          }

          // Get grounding metadata (sources) for Research
          const groundingMeta = await result.getGroundingMetadata();
          if (groundingMeta?.groundingChunks) {
            const sources: GroundingSource[] = groundingMeta.groundingChunks
              .filter((chunk: any) => chunk.web)
              .map((chunk: any) => ({
                uri: chunk.web.uri,
                title: chunk.web.title
              }));
            
            if (sources.length > 0) {
              setMessages((prev) =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, sources }
                    : msg
                )
              );
            }
          }

        } catch (error) {
          console.error('Deep Research error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          setMessages((prev) =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: `Error en investigación profunda: ${errorMessage}` }
                : msg
            )
          );
        } finally {
          setIsLoading(false);
        }
        return;
      }

      const result = await import('../services/gemini').then(m => m.sendMessageStream(apiMessage, pageContext));

      let fullText = '';

      for await (const chunk of result.stream) {
        let chunkText = '';
        try {
          chunkText = chunk.text();
        } catch (e) {
          // Might be a function call only
        }
        
        fullText += chunkText;

        // Check for function calls (e.g. Navigation)
        const functionCalls = chunk.functionCalls ? chunk.functionCalls() : [];
        if (functionCalls) {
          for (const call of functionCalls) {
            if (call.name === 'open_url') {
              const url = (call.args as any).url as string;
              if (url) {
                if (window.chrome && chrome.tabs && chrome.tabs.create) {
                  chrome.tabs.create({ url });
                } else {
                  window.open(url, '_blank');
                }
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, text: fullText }
              : msg
          )
        );
      }
      
      // Get grounding metadata (sources)
      const groundingMeta = await result.getGroundingMetadata();
      if (groundingMeta?.groundingChunks) {
        const sources: GroundingSource[] = groundingMeta.groundingChunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
            uri: chunk.web.uri,
            title: chunk.web.title
          }));
        
        if (sources.length > 0) {
          setMessages((prev) =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, sources }
                : msg
            )
          );
        }
      }

      // Detectar y ejecutar acciones
      const actionPattern = /\[ACTION:(\w+):(\d+)(?::([^\]]+))?\]/g;
      let match;

      console.log('=== DETECCIÓN DE ACCIONES ===');
      console.log('Texto completo:', fullText);

      while ((match = actionPattern.exec(fullText)) !== null) {
        const actionType = match[1];
        const elementIndex = parseInt(match[2]);
        const actionValue = match[3];

        console.log(`✓ Acción encontrada: ${actionType}, índice: ${elementIndex}, valor: ${actionValue}`);

        try {
          // Obtener todas las pestañas de la ventana actual
          const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
          console.log('Pestañas encontradas:', tabs.length, tabs.map(t => ({ id: t.id, url: t.url?.substring(0, 50) })));

          // Filtrar para obtener la pestaña real (no la del side panel)
          const tab = tabs.find(t => t.url && !t.url.startsWith('chrome-extension://'));

          if (!tab) {
            console.error('No se encontró pestaña válida');
            continue;
          }

          console.log('Tab seleccionada:', tab.id, tab.url?.substring(0, 80));

          if (tab.id) {
            console.log('Enviando mensaje al content script...');
            const response = await chrome.tabs.sendMessage(tab.id, {
              action: "executeAction",
              actionData: {
                type: actionType,
                index: elementIndex,
                value: actionValue
              }
            });
            console.log('✓ Respuesta del content script:', response);
          }
        } catch (actionError) {
          console.error('✗ Error ejecutando acción:', actionError);
        }
      }

      console.log('=== FIN DETECCIÓN ===');


    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessages((prev) =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, text: `Lo siento, hubo un error: ${errorMessage}. Verifica tu API Key en src/config.ts` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasInput = inputValue.trim().length > 0 || selectedImages.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark-main)' }}>
      {/* Header */}
      <header style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--bg-dark-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isLiveActive ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-dark-main)',
        transition: 'background-color 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={liaAvatar}
            alt="Lia"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${isLiveActive ? 'var(--color-success)' : 'var(--color-accent)'}`
            }}
          />
          <div>
            <h1 style={{
              fontSize: '15px',
              fontWeight: 600,
              margin: 0,
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Lia
              {isLiveActive && (
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  backgroundColor: 'var(--color-success)',
                  borderRadius: '4px',
                  color: 'white'
                }}>LIVE</span>
              )}
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--color-gray-medium)' }}>
              {isLiveActive ? 'Conectada en tiempo real' : 'Tu asistente de productividad'}
            </span>
            
            {/* Active Mode Indicator in Header */}
            {(isDeepResearch || isImageGenMode) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '6px',
                padding: '4px 10px',
                background: isDeepResearch ? 'rgba(0, 212, 179, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                borderRadius: '12px',
                fontSize: '11px',
                color: isDeepResearch ? '#00d4b3' : '#a855f7',
                fontWeight: 500
              }}>
                {isDeepResearch ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                )}
                {isDeepResearch ? 'Deep Research' : 'Generación de Imagen'}
                <button
                  onClick={() => {
                    setIsDeepResearch(false);
                    setIsImageGenMode(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    marginLeft: '2px',
                    cursor: 'pointer',
                    color: 'inherit',
                    display: 'flex',
                    opacity: 0.7
                  }}
                  title="Desactivar modo"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', position: 'relative' }}>
          <button 
            onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
            style={{
              background: isSettingsMenuOpen ? 'var(--bg-dark-tertiary)' : 'var(--bg-dark-secondary)',
              border: `1px solid ${isSettingsMenuOpen ? 'var(--color-accent)' : 'transparent'}`,
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: isSettingsMenuOpen ? 'var(--color-accent)' : 'var(--color-gray-medium)',
              transition: 'all 0.2s'
            }}
            title="Configuración"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {/* Settings Dropdown */}
          {isSettingsMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              background: 'var(--bg-modal)',
              border: '1px solid var(--border-modal)',
              borderRadius: '12px',
              padding: '8px',
              minWidth: '200px',
              boxShadow: 'var(--shadow-modal)',
              zIndex: 1000
            }}>
              {/* Theme Selector */}
              <div style={{ padding: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-medium)', marginBottom: '8px' }}>
                  Tema
                </div>
                <div style={{ display: 'flex', background: 'var(--bg-dark-secondary)', borderRadius: '8px', padding: '2px' }}>
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      style={{
                        flex: 1,
                        background: theme === t ? 'var(--color-accent)' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: theme === t ? (theme === 'light' ? '#fff' : '#000') : 'var(--color-gray-medium)', // Fix text contrast
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={t === 'light' ? 'Claro' : t === 'dark' ? 'Oscuro' : 'Sistema'}
                    >
                      {t === 'light' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="3" y2="12" />
                          <line x1="21" y1="12" x2="23" y2="12" />
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                      )}
                      {t === 'dark' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      )}
                      {t === 'system' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--border-modal)', margin: '4px 0 8px 0' }}></div>

              {/* Clear Chat */}
              <button
                onClick={() => {
                  setMessages([]);
                  setIsSettingsMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Borrar Conversación
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Welcome */}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <img
              src={liaAvatar}
              alt="Lia"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--color-accent)',
                marginBottom: '16px'
              }}
            />
            <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', fontWeight: 600, color: 'var(--color-white)' }}>
              Hola, soy Lia
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              Tu asistente de productividad para Ecos de Liderazgo. ¿En qué puedo ayudarte?
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {['Analizar página', 'Resumir contenido', 'Ayuda con tareas'].map((action) => (
                <button
                  key={action}
                  onClick={() => handleSendMessage(action)}
                  style={{
                    background: 'var(--bg-dark-secondary)',
                    border: '1px solid transparent',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: 'var(--color-white)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages - filter out empty model messages to avoid duplicate loaders */}
        {messages.filter(msg => !(msg.role === 'model' && !msg.text)).map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '8px',
              alignItems: 'flex-start'
            }}
          >
            {msg.role === 'model' && (
              <img
                src={liaAvatar}
                alt="Lia"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            )}

            <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div
                className={msg.role === 'model' ? 'markdown-content' : ''}
                style={{
                  backgroundColor: msg.role === 'user' ? 'var(--color-accent)' : 'var(--bg-dark-secondary)',
                  color: msg.role === 'user' ? 'var(--color-on-accent)' : 'var(--color-white)',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {msg.images && msg.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    {msg.images.map((img, i) => (
                      <div 
                        key={i}
                        className="image-container"
                        style={{ position: 'relative', cursor: 'pointer', maxWidth: '200px' }}
                        onClick={() => setZoomedImage(img)}
                      >
                        <img 
                          src={img} 
                          alt="Generada por IA" 
                          style={{ 
                            width: '100%', 
                            borderRadius: '12px',
                            display: 'block',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }} 
                        />
                        {/* Hover Overlay */}
                        <div className="zoom-overlay" style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </div>
                        <style>{`
                          .image-container:hover .zoom-overlay {
                            opacity: 1 !important;
                          }
                        `}</style>
                      </div>
                    ))}
                  </div>
                )}
                {msg.role === 'model' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>

              {/* Sources */}
              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: 'var(--bg-dark-tertiary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-modal)'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--color-accent)',
                    fontWeight: 600,
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    {msg.sources.length} {msg.sources.length === 1 ? 'fuente revisada' : 'fuentes revisadas'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {msg.sources.slice(0, 3).map((source, i) => (
                      <a
                        key={i}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-white)',
                          textDecoration: 'none',
                          padding: '4px 8px',
                          background: 'var(--bg-dark-secondary)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          overflow: 'hidden'
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" style={{ flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        <span style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {source.title || new URL(source.uri).hostname}
                        </span>
                      </a>
                    ))}
                    {msg.sources.length > 3 && (
                      <span style={{ fontSize: '11px', color: 'var(--color-gray-medium)', marginLeft: '8px' }}>
                        +{msg.sources.length - 3} fuentes más
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {msg.role === 'model' && msg.text && (
                <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                  <button
                    onClick={() => copyToClipboard(msg.text)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: 'var(--color-gray-medium)',
                      borderRadius: '4px'
                    }}
                    title="Copiar"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  {/* Like Button */}
                  <button
                    onClick={() => addReaction(msg.id, 'like')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: msg.reactions?.includes('like') ? 'var(--color-accent)' : 'var(--color-gray-medium)',
                      borderRadius: '4px'
                    }}
                    title="Me gusta"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={msg.reactions?.includes('like') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </button>

                  {/* Dislike Button */}
                  <button
                    onClick={() => addReaction(msg.id, 'dislike')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: msg.reactions?.includes('dislike') ? '#ef4444' : 'var(--color-gray-medium)',
                      borderRadius: '4px'
                    }}
                    title="No me gusta"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={msg.reactions?.includes('dislike') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                  </button>

                  {/* Regenerate Button */}
                  <button
                    onClick={() => {
                      /* Todo: Implement regeneration logic */
                      console.log('Regenerate requested');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: 'var(--color-gray-medium)',
                      borderRadius: '4px'
                    }}
                    title="Regenerar respuesta"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <polyline points="1 20 1 14 7 14"></polyline>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <img
              src={liaAvatar}
              alt="Lia"
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{
              backgroundColor: 'var(--bg-dark-secondary)',
              padding: '12px 16px',
              borderRadius: '16px',
              borderBottomLeftRadius: '4px'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span className="typing-dot" style={{ animationDelay: '0ms' }}>•</span>
                <span className="typing-dot" style={{ animationDelay: '150ms' }}>•</span>
                <span className="typing-dot" style={{ animationDelay: '300ms' }}>•</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--bg-dark-secondary)',
        background: 'var(--bg-dark-main)'
      }}>
        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {selectedImages.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <button
                  onClick={() => removeImage(i)}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Selected Context from Page */}
        {selectedContext && (
          <div style={{
            background: 'var(--bg-dark-tertiary)',
            border: '1px solid var(--color-accent)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="var(--color-accent)" 
                strokeWidth="2"
                style={{ flexShrink: 0, marginTop: '2px' }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--color-accent)', 
                  fontWeight: 600,
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Texto seleccionado
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--color-white)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.5',
                  fontStyle: 'italic',
                  opacity: 0.9
                }}>
                  "{selectedContext.text.length > 200 
                    ? selectedContext.text.substring(0, 200) + '...' 
                    : selectedContext.text}"
                </div>
              </div>
              <button
                onClick={clearSelectedContext}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                title="Quitar contexto"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        )}

        <div style={{
          background: 'var(--bg-dark-secondary)',
          borderRadius: '24px',
          padding: '6px 6px 6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: isRecording ? '2px solid #ef4444' : '1px solid transparent'
        }}>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
          
          {/* Plus Menu Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
              style={{
                background: isPlusMenuOpen ? 'rgba(0, 212, 179, 0.2)' : 'none',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                color: isPlusMenuOpen ? '#00d4b3' : 'var(--color-gray-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title="Más opciones"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isPlusMenuOpen && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '0',
                marginBottom: '8px',
                background: 'var(--bg-modal)',
                border: '1px solid var(--border-modal)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '200px',
                boxShadow: 'var(--shadow-modal)',
                zIndex: 1000
              }}>
                {/* Deep Research */}
                <button
                  onClick={() => {
                    setIsDeepResearch(!isDeepResearch);
                    setIsImageGenMode(false);
                    setIsPlusMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: isDeepResearch ? 'rgba(0, 212, 179, 0.15)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isDeepResearch ? '#00d4b3' : 'var(--color-white)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <div>
                    <div style={{ fontWeight: 500 }}>Deep Research</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-medium)' }}>Investigación profunda</div>
                  </div>
                  {isDeepResearch && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00d4b3" style={{ marginLeft: 'auto' }}>
                      <polyline points="20 6 9 17 4 12" stroke="#00d4b3" strokeWidth="2" fill="none"></polyline>
                    </svg>
                  )}
                </button>
                
                {/* Live API */}
                <button
                  onClick={() => {
                    handleLiveToggle();
                    setIsPlusMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: isLiveActive ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isLiveActive ? '#ef4444' : 'var(--color-white)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  <div>
                    <div style={{ fontWeight: 500 }}>Conversación en Vivo</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-medium)' }}>Audio en tiempo real</div>
                  </div>
                  {isLiveActive && (
                    <div style={{ 
                      marginLeft: 'auto', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: '#ef4444',
                      animation: 'pulse 1s infinite'
                    }}></div>
                  )}
                </button>
                
                {/* Image Generation */}
                <button
                  onClick={() => {
                    setIsImageGenMode(!isImageGenMode);
                    setIsDeepResearch(false);
                    setIsPlusMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: isImageGenMode ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isImageGenMode ? '#a855f7' : 'var(--color-white)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <div>
                    <div style={{ fontWeight: 500 }}>Generar Imagen</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-medium)' }}>Crea imágenes con IA</div>
                  </div>
                  {isImageGenMode && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#a855f7" style={{ marginLeft: 'auto' }}>
                      <polyline points="20 6 9 17 4 12" stroke="#a855f7" strokeWidth="2" fill="none"></polyline>
                    </svg>
                  )}
                </button>
                
                <div style={{ height: '1px', background: 'var(--border-modal)', margin: '8px 0' }}></div>
                
                {/* Attach File */}
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsPlusMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                  <div>
                    <div style={{ fontWeight: 500 }}>Adjuntar Archivo</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-medium)' }}>Sube imágenes</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isRecording}
            placeholder={isRecording ? "Escuchando..." : "Escribe un mensaje..."}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-white)',
              flex: 1,
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif'
            }}
          />

          {/* Mic / Send Button */}
          {hasInput ? (
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              style={{
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-on-accent)" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          ) : (
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              style={{
                background: isRecording ? '#ef4444' : 'var(--bg-dark-tertiary)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isRecording ? 'white' : 'var(--color-gray-medium)'} strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          )}
        </div>
      </footer>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setZoomedImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
            <img 
              src={zoomedImage} 
              alt="Zoomed view" 
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                objectFit: 'contain'
              }}
              onClick={(e) => e.stopPropagation()} 
            />
            <button
              onClick={() => setZoomedImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
