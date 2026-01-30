import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  // Options
  const nationalityOptions = [
    { value: "MX", label: "México" },
    { value: "AR", label: "Argentina" },
    { value: "CO", label: "Colombia" },
    { value: "ES", label: "España" },
    { value: "US", label: "Estados Unidos" },
    { value: "CL", label: "Chile" },
    { value: "PE", label: "Perú" },
    { value: "OTHER", label: "Otro" }
  ];

  // Datos personales
  const [firstName, setFirstName] = useState('');
  const [lastNameP, setLastNameP] = useState('');
  const [lastNameM, setLastNameM] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'register') {
        if (email !== confirmEmail) throw new Error("Los correos no coinciden.");
        if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden.");
        if (password.length < 6) throw new Error("La contraseña es muy corta (min 6).");

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name_p: lastNameP,
              last_name_m: lastNameM,
              phone: phone,
              nationality: nationality,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastNameP)}&background=random`
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: '¡Cuenta creada! Revisa tu correo.' });
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || error.error_description });
    } finally {
      setLoading(false);
    }
  };

  // Iconos SVG
  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  );
  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0F1419', // Fondo Principal Oscuro (Sofia Design)
      color: '#ffffff',
      padding: '32px 16px',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* Logo */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
         <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '70px', height: '70px', background: 'radial-gradient(circle, rgba(0, 212, 179, 0.4) 0%, transparent 70%)', // Aqua Glow
          filter: 'blur(15px)', zIndex: 0
        }} />
        <img src="/assets/Icono.png" alt="Lia" style={{ width: '64px', height: '64px', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
          {mode === 'login' ? 'Bienvenido a Lia' : 'Crear cuenta'}
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          {mode === 'login' ? 'Accede a tu asistente personal' : 'Únete para potenciar tu productividad'}
        </p>
      </div>

      <form onSubmit={handleAuth} style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {mode === 'register' && (
          <>
             <div className="input-group">
                <input type="text" placeholder="Nombre(s)" value={firstName} onChange={e => setFirstName(e.target.value)} required style={inputStyle} />
             </div>
             <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Apellido P." value={lastNameP} onChange={e => setLastNameP(e.target.value)} required style={inputStyle} />
                <input type="text" placeholder="Apellido M." value={lastNameM} onChange={e => setLastNameM(e.target.value)} required style={inputStyle} />
             </div>
             <div style={{ display: 'flex', gap: '8px' }}>
                <input type="tel" placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} required style={inputStyle} />
                
                {/* Custom Dropdown for Nationality */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => setShowNationalityDropdown(!showNationalityDropdown)}
                    style={{
                      ...inputStyle,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: nationality ? 'white' : '#94a3b8'
                    }}
                  >
                    {nationality ? nationalityOptions.find(o => o.value === nationality)?.label : 'País'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showNationalityDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  {showNationalityDropdown && (
                    <>
                      {/* Backdrop invisible para cerrar al hacer clic fuera */}
                      <div 
                        style={{ position: 'fixed', inset: 0, zIndex: 10 }} 
                        onClick={() => setShowNationalityDropdown(false)}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        width: '100%',
                        background: '#1E2329',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        zIndex: 20,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        {nationalityOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setNationality(option.value);
                              setShowNationalityDropdown(false);
                            }}
                            style={{
                              padding: '10px 14px',
                              fontSize: '13px',
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(255,255,255,0.03)',
                              color: nationality === option.value ? '#00D4B3' : 'white', // Aqua selected
                              background: nationality === option.value ? 'rgba(0, 212, 179, 0.1)' : 'transparent',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                               if (nationality !== option.value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                               if (nationality !== option.value) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
             </div>
             <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
          </>
        )}

        {/* Email */}
        <div className="input-group">
           <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        </div>
        
        {mode === 'register' && (
           <div className="input-group">
              <input type="email" placeholder="Confirmar correo" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)} required onPaste={e => e.preventDefault()} style={inputStyle} />
           </div>
        )}

        {/* Password */}
        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{...inputStyle, paddingRight: '36px'}} 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={eyeButtonStyle}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>

        {mode === 'register' && (
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirmar contraseña" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                style={{...inputStyle, paddingRight: '36px'}} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={eyeButtonStyle}
              >
                {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
        )}

        {message && (
          <div style={{ 
            padding: '10px', borderRadius: '8px', fontSize: '12px', textAlign: 'center',
            backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
            border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
          }}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '12px',
            background: 'linear-gradient(135deg, #00D4B3 0%, #00a88d 100%)', // SOFIA AQUA / GREEN
            color: '#0A2540', // Dark text on bright button for contrast
            border: 'none',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 4px 15px rgba(0, 212, 179, 0.3)', // Aqua Glow
            opacity: loading ? 0.7 : 1,
            transition: 'transform 0.1s, box-shadow 0.2s',
          }}
          onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {loading ? 'Procesando...' : (mode === 'login' ? 'Entrar' : 'Registrarse')}
        </button>

      </form>

      <div style={{ marginTop: '24px', fontSize: '13px', color: '#94a3b8' }}>
        <span>{mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(null); }}
          style={{ background: 'none', border: 'none', color: '#00D4B3', fontWeight: '600', cursor: 'pointer', marginLeft: '6px' }}
        >
          {mode === 'login' ? 'Regístrate' : 'Inicia Sesión'}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: '#1E2329', // Fondo Secundario Oscuro
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '12px 14px',
  borderRadius: '10px',
  color: 'white',
  outline: 'none',
  fontSize: '14px',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};

const eyeButtonStyle = {
  position: 'absolute' as const,
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '4px'
};
