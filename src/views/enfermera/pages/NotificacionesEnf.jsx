import React from 'react';
import { useNotificacionesEnf } from '../hooks/useNotificacionesEnf';

const DESTINATARIOS = [
    { value: 'MEDICO',     label: '🩺 Doctor' },
    { value: 'ADMIN',      label: '📋 Administrativo' },
    { value: 'ADMIN_TI',   label: '🖥️ Administrador TI' },
];

export default function NotificacionesEnf({ user }) {
    const { lista, destinatario, setDestinatario, mensaje, setMensaje, enviando, msg, emitirAlerta } = useNotificacionesEnf(user?.accessToken);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '720px' }}>

            <div>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: '#033323', fontWeight: 700 }}>🔔 Notificaciones</h1>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                    Recibe alertas del sistema y envía mensajes internos al equipo médico.
                </p>
            </div>

            {/* Formulario envío */}
            <div style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 700, color: '#033323' }}>
                    📤 Enviar mensaje interno
                </h3>
                {msg && (
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem', background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#065f46' : '#b91c1c', border: `1px solid ${msg.ok ? '#bbf7d0' : '#fecaca'}` }}>
                        {msg.txt}
                    </div>
                )}
                <form onSubmit={emitirAlerta} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={lblSt}>Destinatario</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {DESTINATARIOS.map(d => (
                                <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => setDestinatario(d.value)}
                                    style={{
                                        padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer', fontWeight: 600,
                                        border: destinatario === d.value ? '2px solid #033323' : '2px solid #e5e7eb',
                                        background: destinatario === d.value ? '#033323' : '#f9fafb',
                                        color: destinatario === d.value ? '#fff' : '#374151',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={lblSt}>Mensaje</label>
                        <textarea
                            value={mensaje}
                            onChange={e => setMensaje(e.target.value)}
                            placeholder="Escribe tu mensaje aquí... (Ej: Paciente en triaje requiere atención urgente)"
                            required
                            rows={4}
                            style={{ ...inputSt, resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={enviando || !mensaje.trim()} style={{
                            background: enviando ? '#9ca3af' : '#033323', color: '#fff', border: 'none',
                            padding: '0.65rem 1.75rem', borderRadius: '8px', cursor: enviando ? 'not-allowed' : 'pointer',
                            fontWeight: 700, fontSize: '0.9rem'
                        }}>
                            {enviando ? '⏳ Enviando...' : '📤 Enviar mensaje'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Lista de notificaciones */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#033323' }}>
                        📥 Bandeja de entrada ({lista.length})
                    </h3>
                </div>
                {lista.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
                        <p style={{ margin: 0 }}>No hay notificaciones.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {lista.map((n, i) => (
                            <div key={n.codNotificacion || i} style={{
                                padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6',
                                background: n.leida ? '#fff' : '#f0fdf4',
                                borderLeft: n.leida ? '3px solid transparent' : '3px solid #0d9488'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>
                                        {!n.leida && '🔵 '}{n.titulo || 'Notificación'}
                                    </span>
                                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                                        {n.fecha ? new Date(n.fecha).toLocaleString('es-PE') : 'Ahora'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.87rem', color: '#374151' }}>{n.mensaje}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const lblSt = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' };
const inputSt = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };