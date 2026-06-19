import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

export default function PerfilEnfermera({ user }) {
    const [perfil, setPerfil] = useState({ nombre: '', apellidos: '' });
    const [pwd, setPwd] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });
    const [showPwd, setShowPwd] = useState({ actual: false, nueva: false, confirmar: false });
    const [guardando, setGuardando] = useState(false);
    const [cambiando, setCambiando] = useState(false);
    const [msgPerfil, setMsgPerfil] = useState(null);
    const [msgPwd, setMsgPwd] = useState(null);
    const [loading, setLoading] = useState(true);

    const dni = user?.dni || user?.username || '-';

    useEffect(() => {
        if (!user?.accessToken) return;
        const partes = (user.nombreCompleto || '').split(' ');
        setPerfil({ nombre: partes[0] || '', apellidos: partes.slice(1).join(' ') || '' });
        setLoading(false);
    }, [user]);

    const handleGuardar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        try {
            const res = await axios.put(`${API}/api/usuarios/perfil`, perfil, {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            });
            const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
            localStorage.setItem('cam_user', JSON.stringify({ ...session, nombreCompleto: res.data.nombreCompleto }));
            setMsgPerfil({ ok: true, txt: '✅ Nombre actualizado correctamente.' });
        } catch {
            setMsgPerfil({ ok: false, txt: '⚠️ No se pudo guardar. Verifica la conexión.' });
        } finally {
            setGuardando(false);
        }
    };

    const handleCambiarPwd = async (e) => {
        e.preventDefault();
        if (pwd.passwordNueva !== pwd.confirmar) {
            setMsgPwd({ ok: false, txt: '⚠️ Las contraseñas nuevas no coinciden.' });
            return;
        }
        if (pwd.passwordNueva.length < 6) {
            setMsgPwd({ ok: false, txt: '⚠️ La nueva contraseña debe tener mínimo 6 caracteres.' });
            return;
        }
        setCambiando(true);
        try {
            await axios.put(`${API}/api/usuarios/perfil/password`, {
                passwordActual: pwd.passwordActual,
                passwordNueva: pwd.passwordNueva,
            }, { headers: { Authorization: `Bearer ${user?.accessToken}` } });
            setMsgPwd({ ok: true, txt: '✅ Contraseña cambiada exitosamente.' });
            setPwd({ passwordActual: '', passwordNueva: '', confirmar: '' });
        } catch (err) {
            const msg = err.response?.data?.error || 'Error al cambiar la contraseña.';
            setMsgPwd({ ok: false, txt: `⚠️ ${msg}` });
        } finally {
            setCambiando(false);
        }
    };

    const iniciales = `${perfil.nombre[0] || ''}${perfil.apellidos[0] || ''}`.toUpperCase() || 'ENF';

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Cargando...</div>;

    return (
        <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: '#033323', fontWeight: 700 }}>Mi Perfil</h1>

            {/* Avatar */}
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={avatarSt}>{iniciales}</div>
                <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>
                        {perfil.nombre} {perfil.apellidos}
                    </p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                        🏥 Enfermería y Triaje · CAM Pucallpa
                    </p>
                </div>
            </div>

            {/* Datos personales */}
            <div style={card}>
                <h3 style={secTitle}>Datos personales</h3>
                {msgPerfil && <Alert ok={msgPerfil.ok} txt={msgPerfil.txt} />}
                <form onSubmit={handleGuardar}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={lblSt}>
                            DNI <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.78rem' }}>(no editable)</span>
                        </label>
                        <div style={dniBox}>{dni}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label style={lblSt}>Nombre(s)</label>
                            <input name="nombre" value={perfil.nombre} onChange={e => { setPerfil(p => ({ ...p, nombre: e.target.value })); setMsgPerfil(null); }}
                                placeholder="Tu nombre" style={inputSt} />
                        </div>
                        <div>
                            <label style={lblSt}>Apellidos</label>
                            <input name="apellidos" value={perfil.apellidos} onChange={e => { setPerfil(p => ({ ...p, apellidos: e.target.value })); setMsgPerfil(null); }}
                                placeholder="Tus apellidos" style={inputSt} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={guardando} style={btnPrimary(guardando)}>
                            {guardando ? '⏳ Guardando...' : '💾 Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Cambiar contraseña */}
            <div style={card}>
                <h3 style={secTitle}>🔐 Cambiar contraseña</h3>
                {msgPwd && <Alert ok={msgPwd.ok} txt={msgPwd.txt} />}
                <form onSubmit={handleCambiarPwd}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                        <PwdField label="Contraseña actual" name="passwordActual" value={pwd.passwordActual}
                            show={showPwd.actual} onToggle={() => setShowPwd(p => ({ ...p, actual: !p.actual }))}
                            onChange={e => { setPwd(p => ({ ...p, [e.target.name]: e.target.value })); setMsgPwd(null); }}
                            placeholder="Tu contraseña actual" />
                        <PwdField label="Nueva contraseña" name="passwordNueva" value={pwd.passwordNueva}
                            show={showPwd.nueva} onToggle={() => setShowPwd(p => ({ ...p, nueva: !p.nueva }))}
                            onChange={e => { setPwd(p => ({ ...p, [e.target.name]: e.target.value })); setMsgPwd(null); }}
                            placeholder="Mínimo 6 caracteres" />
                        <PwdField label="Confirmar nueva contraseña" name="confirmar" value={pwd.confirmar}
                            show={showPwd.confirmar} onToggle={() => setShowPwd(p => ({ ...p, confirmar: !p.confirmar }))}
                            onChange={e => { setPwd(p => ({ ...p, [e.target.name]: e.target.value })); setMsgPwd(null); }}
                            placeholder="Repite la nueva contraseña" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={cambiando} style={btnDanger(cambiando)}>
                            {cambiando ? '⏳ Cambiando...' : '🔑 Cambiar contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PwdField({ label, name, value, show, onToggle, onChange, placeholder }) {
    return (
        <div>
            <label style={lblSt}>{label}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input name={name} type={show ? 'text' : 'password'} value={value} onChange={onChange}
                    placeholder={placeholder} required style={{ ...inputSt, paddingRight: '2.8rem' }} />
                <button type="button" onClick={onToggle} style={eyeBtn} title={show ? 'Ocultar' : 'Mostrar'}>
                    {show
                        ? <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                </button>
            </div>
        </div>
    );
}

function Alert({ ok, txt }) {
    return (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem', background: ok ? '#f0fdf4' : '#fef2f2', color: ok ? '#065f46' : '#b91c1c', border: `1px solid ${ok ? '#bbf7d0' : '#fecaca'}` }}>
            {txt}
        </div>
    );
}

const card = { background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const secTitle = { margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#033323' };
const lblSt = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' };
const inputSt = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const dniBox = { padding: '0.65rem 0.9rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', background: '#f9fafb', color: '#6b7280', fontFamily: 'monospace', letterSpacing: '0.08em' };
const eyeBtn = { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', padding: '4px' };
const avatarSt = { width: 60, height: 60, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#0f172a,#0d9488)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 };
const btnPrimary = d => ({ background: d ? '#9ca3af' : '#033323', color: '#fff', border: 'none', padding: '0.65rem 1.75rem', borderRadius: '8px', cursor: d ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem' });
const btnDanger = d => ({ background: d ? '#9ca3af' : '#991b1b', color: '#fff', border: 'none', padding: '0.65rem 1.75rem', borderRadius: '8px', cursor: d ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem' });
