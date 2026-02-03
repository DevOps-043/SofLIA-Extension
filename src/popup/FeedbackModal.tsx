import React, { useState } from 'react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'positive' | 'negative' | null;
    messageContent: string;
    modelUsed: string;
    user: any;
    supabase: any;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
    isOpen, onClose, type, messageContent, modelUsed, user, supabase 
}) => {
    const [rating, setRating] = useState(5);
    const [reasonCategory, setReasonCategory] = useState<string>('');
    const [feedbackText, setFeedbackText] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen || !type) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                user_id: user?.id,
                message_content: messageContent,
                model_used: modelUsed,
                feedback_type: type,
                rating: type === 'positive' ? rating : undefined,
                reason_category: type === 'negative' ? reasonCategory : undefined,
                feedback_text: feedbackText
            };

            const { error } = await supabase.from('message_feedback').insert(payload);
            
            if (error) throw error;
            
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false); // Reset for next time
                setRating(5);
                setReasonCategory('');
                setFeedbackText('');
            }, 1500);

        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const reasons = [
        { id: 'inaccurate', label: 'Impreciso / Alucinación' },
        { id: 'incomplete', label: 'Incompleto' },
        { id: 'unsafe', label: 'Ofensivo / Inseguro' },
        { id: 'lazy', label: 'Respuesta Vaga' },
        { id: 'other', label: 'Otro' }
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: '400px',
                backgroundColor: 'var(--bg-modal)',
                borderRadius: '16px',
                border: '1px solid var(--border-modal)',
                boxShadow: 'var(--shadow-modal)',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ 
                            width: '48px', height: '48px', borderRadius: '50%', 
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10B981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px auto', fontSize: '24px'
                        }}>✓</div>
                        <h3 style={{ color: 'var(--color-white)', margin: 0, fontSize: '16px' }}>
                            ¡Gracias por tu feedback!
                        </h3>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--color-white)' }}>
                                {type === 'positive' ? 'Calificar Respuesta' : 'Reportar Problema'}
                            </h3>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-gray-medium)', cursor: 'pointer' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Content Like */}
                        {type === 'positive' && (
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: star <= rating ? '#F59E0B' : 'var(--border-modal)',
                                                fontSize: '28px', transition: 'transform 0.1s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-gray-medium)' }}>
                                    ¿Qué tan útil fue esta respuesta?
                                </p>
                            </div>
                        )}

                        {/* Content Dislike */}
                        {type === 'negative' && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '13px', color: 'var(--color-gray-medium)', marginBottom: '12px' }}>
                                    ¿Qué salió mal con esta respuesta?
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                    {reasons.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => setReasonCategory(r.id)}
                                            style={{
                                                padding: '6px 12px', borderRadius: '20px', fontSize: '12px',
                                                border: reasonCategory === r.id ? '1px solid var(--color-accent)' : '1px solid var(--border-modal)',
                                                background: reasonCategory === r.id ? 'rgba(0, 212, 179, 0.1)' : 'transparent',
                                                color: reasonCategory === r.id ? 'var(--color-accent)' : 'var(--color-gray-medium)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    placeholder="Detalles adicionales (opcional)..."
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    style={{
                                        width: '100%', height: '80px', padding: '12px',
                                        backgroundColor: 'var(--bg-dark-tertiary)',
                                        border: '1px solid var(--border-modal)',
                                        borderRadius: '8px',
                                        color: 'var(--color-white)',
                                        fontSize: '13px', outline: 'none', resize: 'none'
                                    }}
                                />
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={onClose}
                                style={{
                                    padding: '8px 16px', borderRadius: '8px', background: 'transparent',
                                    border: '1px solid var(--border-modal)', color: 'var(--color-gray-medium)',
                                    cursor: 'pointer', fontSize: '13px'
                                }}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || (type === 'negative' && !reasonCategory)}
                                style={{
                                    padding: '8px 20px', borderRadius: '8px', border: 'none',
                                    background: 'var(--color-accent)', 
                                    color: 'var(--color-on-accent, white)', /* Ensures white text if logic fails */
                                    cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                                    opacity: (loading || (type === 'negative' && !reasonCategory)) ? 0.5 : 1
                                }}
                            >
                                {loading ? 'Enviando...' : 'Enviar'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
