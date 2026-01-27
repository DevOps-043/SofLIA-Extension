import { useState, useEffect } from 'react';
import { GeminiService } from '../services/gemini';
import { TabService } from '../services/tabs';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [gemini, setGemini] = useState<GeminiService | null>(null);
  
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hola, soy Lia. Para empezar, necesito tu API Key de Google Gemini.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if key is saved
    chrome.storage.local.get(['geminiApiKey'], (result) => {
      if (result.geminiApiKey) {
        setApiKey(result.geminiApiKey);
        initializeGemini(result.geminiApiKey);
      }
    });
  }, []);

  const initializeGemini = (key: string) => {
    try {
      const service = new GeminiService(key);
      setGemini(service);
      setHasKey(true);
      setMessages(prev => [...prev, { role: 'assistant', content: '¡Conectado! Lia ahora puede leer la página que estás viendo. ¿Qué necesitas?' }]);
    } catch (error) {
        console.error("Error init gemini", error);
    }
  };

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
      initializeGemini(apiKey);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !gemini) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // 1. Get Page Context
      let pageContext = { title: 'Desconocido', url: 'Desconocido', content: '' };
      try {
          pageContext = await TabService.getCurrentTabAsString();
      } catch (err) {
          console.warn("No se pudo leer el contexto:", err);
      }
      
      // 2. Construct Prompt with Context
      const promptWithContext = `
[CONTEXTO DEL SISTEMA]
El usuario está viendo esta página web:
- Título: ${pageContext.title}
- URL: ${pageContext.url}
- Contenido (truncado): ${pageContext.content}

Instrucción: Eres Lia, un asistente de IA útil. Usa el contexto anterior para responder si es relevante. Si no, responde normalmente.
---
Mensaje del usuario: ${userMsg}
`;

      // Simple history conversion for now
      const history = messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          parts: m.content
      }));
      
      const response = await gemini.chat(promptWithContext, history);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al conectar. Verifica tu API Key.' }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
     return (
        <div className="container" style={{justifyContent: 'center', padding: '20px'}}>
            <h2>Configuración</h2>
            <p>Introduce tu API Key de Gemini:</p>
            <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Pegar API Key aquí..."
                style={{marginBottom: '10px', width: '100%', boxSizing: 'border-box'}}
            />
            <button onClick={handleSaveKey}>Guardar y Conectar</button>
            <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                Puedes obtenerla en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>.
            </p>
        </div>
     );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Lia AI</h1>
        <button onClick={() => {chrome.storage.local.remove('geminiApiKey'); setHasKey(false); setApiKey('');}} style={{fontSize: '10px', padding: '4px 8px', marginLeft: 'auto'}}>Desconectar</button>
      </header>
      
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="message assistant"><div className="bubble">Analizando página...</div></div>}
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre esta página..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Enviar</button>
      </form>
    </div>
  );
}

export default App;
