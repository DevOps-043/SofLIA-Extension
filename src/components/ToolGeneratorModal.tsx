/**
 * Tool Generator Modal
 * Modal for productivity tool generation (PDFs, diagrams, documents)
 * Renders dynamic forms, AI generation, preview, and export
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getGeneratorConfig,
  generateContent,
  renderMermaidToSvg,
  exportToPdf,
  exportToMarkdown,
  exportSvg,
  exportSvgAsPng,
  GeneratorConfig,
  GeneratedOutput,
} from '../services/tool-generators';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ==========================================
// TYPES
// ==========================================

interface ToolGeneratorModalProps {
  isOpen: boolean;
  generatorId: string | null;
  toolName?: string;
  toolIcon?: string;
  onClose: () => void;
}

type Step = 'form' | 'generating' | 'result';

// ==========================================
// COMPONENT
// ==========================================

export function ToolGeneratorModal({ isOpen, generatorId, toolName, toolIcon, onClose }: ToolGeneratorModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [config, setConfig] = useState<GeneratorConfig | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Load config when generatorId changes
  useEffect(() => {
    if (generatorId) {
      const cfg = getGeneratorConfig(generatorId);
      setConfig(cfg);
      setInputs({});
      setOutput(null);
      setSvgContent('');
      setError(null);
      setStep('form');
      setProgress(0);
    }
  }, [generatorId]);

  // Render Mermaid diagram when output is mermaid type
  const renderDiagram = useCallback(async (code: string) => {
    try {
      const svg = await renderMermaidToSvg(code);
      setSvgContent(svg);
    } catch (err: any) {
      console.error('Mermaid render error:', err);
      setError('Error al renderizar el diagrama. Intentando con formato simplificado...');
    }
  }, []);

  useEffect(() => {
    if (output?.type === 'mermaid' && output.content) {
      renderDiagram(output.content);
    }
  }, [output, renderDiagram]);

  // Handle generation
  const handleGenerate = async () => {
    if (!config || !generatorId) return;

    // Validate required fields
    const missingFields = config.fields
      .filter(f => f.required && !inputs[f.id]?.trim())
      .map(f => f.label);

    if (missingFields.length > 0) {
      setError(`Completa los campos requeridos: ${missingFields.join(', ')}`);
      return;
    }

    setStep('generating');
    setError(null);
    setProgress(10);

    try {
      // Simulate progress
      const progressTimer = setInterval(() => {
        setProgress(p => Math.min(p + Math.random() * 15, 85));
      }, 500);

      const result = await generateContent(generatorId, inputs);
      
      clearInterval(progressTimer);
      setProgress(100);
      setOutput(result);
      setStep('result');
    } catch (err: any) {
      setError(err?.message || 'Error al generar el contenido');
      setStep('form');
      setProgress(0);
    }
  };

  // Handle export actions
  const handleExportPdf = () => {
    if (output?.type === 'markdown') {
      exportToPdf(output.content, output.title);
    }
  };

  const handleExportMd = () => {
    if (output?.type === 'markdown') {
      exportToMarkdown(output.content, output.title);
    }
  };

  const handleExportSvg = () => {
    if (svgContent && output) {
      exportSvg(svgContent, output.title);
    }
  };

  const handleExportPng = () => {
    if (svgContent && output) {
      exportSvgAsPng(svgContent, output.title);
    }
  };

  const handleReset = () => {
    setStep('form');
    setOutput(null);
    setSvgContent('');
    setError(null);
    setProgress(0);
  };

  if (!isOpen || !config) return null;

  return (
    <div className="tg-overlay" onClick={onClose}>
      <style>{cssStyles}</style>
      <div className="tg-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="tg-header">
          <div className="tg-header-left">
            <span className="tg-header-icon">{toolIcon || config.icon}</span>
            <div>
              <h2 className="tg-title">{toolName || config.name}</h2>
              <p className="tg-subtitle">{config.description}</p>
            </div>
          </div>
          <button className="tg-close" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </header>

        {/* Content */}
        <main className="tg-content">
          {/* STEP: FORM */}
          {step === 'form' && (
            <div className="tg-form">
              {config.fields.map(field => (
                <div key={field.id} className="tg-field">
                  <label className="tg-label">
                    {field.label}
                    {field.required && <span className="tg-required">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      className="tg-input"
                      type="text"
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ''}
                      onChange={e => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      className="tg-textarea"
                      placeholder={field.placeholder}
                      rows={4}
                      value={inputs[field.id] || ''}
                      onChange={e => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                    />
                  )}
                  {field.type === 'select' && field.options && (
                    <select
                      className="tg-select"
                      value={inputs[field.id] || ''}
                      onChange={e => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                    >
                      <option value="">Seleccionar...</option>
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              {error && (
                <div className="tg-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  {error}
                </div>
              )}

              <button className="tg-btn-generate" onClick={handleGenerate}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                Generar
              </button>
            </div>
          )}

          {/* STEP: GENERATING */}
          {step === 'generating' && (
            <div className="tg-loading">
              <div className="tg-loading-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="tg-spin">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <h3>Generando {config.outputType === 'diagram' ? 'diagrama' : 'documento'}...</h3>
              <p>La IA está procesando tu solicitud</p>
              <div className="tg-progress-bar">
                <div className="tg-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="tg-progress-text">{Math.round(progress)}%</span>
            </div>
          )}

          {/* STEP: RESULT */}
          {step === 'result' && output && (
            <div className="tg-result">
              {/* Document result */}
              {output.type === 'markdown' && (
                <div className="tg-result-doc">
                  <div className="tg-result-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{output.content}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Diagram result */}
              {output.type === 'mermaid' && (
                <div className="tg-result-diagram">
                  {svgContent ? (
                    <div
                      ref={diagramRef}
                      className="tg-diagram-container"
                      dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                  ) : (
                    <div className="tg-loading-inline">
                      <div className="tg-spinner-sm" />
                      <span>Renderizando diagrama...</span>
                    </div>
                  )}
                  {/* Show raw mermaid code */}
                  <details className="tg-code-details">
                    <summary>Ver código Mermaid</summary>
                    <pre className="tg-code-block">{output.content}</pre>
                  </details>
                </div>
              )}

              {error && (
                <div className="tg-error">{error}</div>
              )}

              {/* Export buttons */}
              <div className="tg-export-bar">
                <span className="tg-export-label">Exportar como:</span>
                <div className="tg-export-btns">
                  {output.type === 'markdown' && (
                    <>
                      <button className="tg-export-btn" onClick={handleExportPdf}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
                        </svg>
                        PDF
                      </button>
                      <button className="tg-export-btn" onClick={handleExportMd}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                        Markdown
                      </button>
                    </>
                  )}
                  {output.type === 'mermaid' && svgContent && (
                    <>
                      <button className="tg-export-btn" onClick={handleExportPng}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        PNG
                      </button>
                      <button className="tg-export-btn" onClick={handleExportSvg}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                        SVG
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="tg-actions">
                <button className="tg-btn-secondary" onClick={handleReset}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
                  </svg>
                  Generar otro
                </button>
                <button className="tg-btn-primary" onClick={onClose}>
                  Listo
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// CSS STYLES
// ==========================================

const cssStyles = `
.tg-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 16px;
  animation: tgFadeIn 0.2s ease;
}
@keyframes tgFadeIn { from { opacity: 0; } to { opacity: 1; } }

.tg-modal {
  background: var(--bg-dark-secondary, #1E2329);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  animation: tgSlideUp 0.3s ease;
}
@keyframes tgSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.tg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: var(--bg-dark-tertiary, #0A0D12);
}
.tg-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.tg-header-icon {
  font-size: 28px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0,212,179,0.15), rgba(16,185,129,0.08));
  border-radius: 12px;
  flex-shrink: 0;
}
.tg-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}
.tg-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6C757D;
}
.tg-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6C757D;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.tg-close:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}

.tg-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Form */
.tg-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tg-label {
  font-size: 13px;
  font-weight: 500;
  color: #E9ECEF;
}
.tg-required {
  color: #00D4B3;
  margin-left: 3px;
}
.tg-input, .tg-textarea, .tg-select {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}
.tg-input:focus, .tg-textarea:focus, .tg-select:focus {
  border-color: #00D4B3;
}
.tg-input::placeholder, .tg-textarea::placeholder {
  color: #6C757D;
}
.tg-textarea {
  resize: vertical;
  min-height: 80px;
}
.tg-select {
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236C757D' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}
.tg-select option {
  background: #1E2329;
  color: #fff;
}

.tg-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #EF4444;
  font-size: 13px;
}

.tg-btn-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #00D4B3, #10B981);
  color: #0A2540;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}
.tg-btn-generate:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 212, 179, 0.3);
}

/* Loading */
.tg-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}
.tg-loading-icon {
  margin-bottom: 16px;
  color: #00D4B3;
}
.tg-spin {
  animation: tgSpin 2s linear infinite;
}
@keyframes tgSpin { to { transform: rotate(360deg); } }

.tg-loading h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #fff;
}
.tg-loading p {
  margin: 0 0 20px;
  font-size: 13px;
  color: #6C757D;
}
.tg-progress-bar {
  width: 100%;
  max-width: 300px;
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
}
.tg-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00D4B3, #10B981);
  border-radius: 3px;
  transition: width 0.3s ease;
}
.tg-progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #6C757D;
}

/* Result */
.tg-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tg-result-preview {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  color: #E9ECEF;
  font-size: 13px;
  line-height: 1.6;
}
.tg-result-preview h1, .tg-result-preview h2, .tg-result-preview h3 {
  color: #fff;
  margin-top: 16px;
  margin-bottom: 8px;
}
.tg-result-preview h1 { font-size: 18px; }
.tg-result-preview h2 { font-size: 15px; }
.tg-result-preview h3 { font-size: 14px; }
.tg-result-preview ul, .tg-result-preview ol {
  padding-left: 20px;
}
.tg-result-preview table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
  font-size: 12px;
}
.tg-result-preview th, .tg-result-preview td {
  border: 1px solid rgba(255,255,255,0.1);
  padding: 6px 10px;
  text-align: left;
}
.tg-result-preview th {
  background: rgba(0,212,179,0.1);
  color: #00D4B3;
  font-weight: 600;
}
.tg-result-preview code {
  background: rgba(255,255,255,0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.tg-result-preview pre {
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
}
.tg-result-preview blockquote {
  border-left: 3px solid #00D4B3;
  padding-left: 12px;
  margin-left: 0;
  color: #6C757D;
}

/* Diagram */
.tg-diagram-container {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 20px;
  overflow: auto;
  max-height: 400px;
  text-align: center;
}
.tg-diagram-container svg {
  max-width: 100%;
  height: auto;
}
.tg-loading-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px;
  color: #6C757D;
  font-size: 13px;
}
.tg-spinner-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #00D4B3;
  border-radius: 50%;
  animation: tgSpin 0.8s linear infinite;
}
.tg-code-details {
  margin-top: 8px;
}
.tg-code-details summary {
  cursor: pointer;
  color: #6C757D;
  font-size: 12px;
  padding: 6px 0;
}
.tg-code-details summary:hover {
  color: #00D4B3;
}
.tg-code-block {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 12px;
  font-size: 11px;
  color: #E9ECEF;
  overflow-x: auto;
  white-space: pre-wrap;
  margin-top: 8px;
}

/* Export Bar */
.tg-export-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0,212,179,0.05);
  border: 1px solid rgba(0,212,179,0.15);
  border-radius: 12px;
  flex-wrap: wrap;
}
.tg-export-label {
  font-size: 13px;
  font-weight: 500;
  color: #6C757D;
  white-space: nowrap;
}
.tg-export-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tg-export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(0,212,179,0.3);
  background: rgba(0,212,179,0.08);
  color: #00D4B3;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tg-export-btn:hover {
  background: #00D4B3;
  color: #0A2540;
}

/* Action buttons */
.tg-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.tg-btn-secondary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: #E9ECEF;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.tg-btn-secondary:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.3);
}
.tg-btn-primary {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: #00D4B3;
  color: #0A2540;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tg-btn-primary:hover {
  filter: brightness(1.1);
}

/* Mobile */
@media (max-width: 480px) {
  .tg-modal { max-height: 95vh; border-radius: 16px; }
  .tg-content { padding: 16px; }
  .tg-export-bar { flex-direction: column; align-items: flex-start; }
  .tg-actions { flex-direction: column; }
  .tg-btn-secondary, .tg-btn-primary { width: 100%; justify-content: center; }
}
`;

export default ToolGeneratorModal;
