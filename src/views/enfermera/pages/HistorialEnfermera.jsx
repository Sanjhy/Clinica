import React, { useState } from 'react';
import { useHistorialEnfermera } from '../hooks/useHistorialEnfermera';

export default function HistorialEnfermera({ user, pacienteId }) {
    const { expediente, historial, loading } = useHistorialEnfermera(pacienteId, user?.accessToken);
    const [tab, setTab] = useState('antecedentes');

    if (!pacienteId) return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: '#033323', fontWeight: 700 }}>📋 Historial Clínico</h1>
            <div style={{ background: '#fff', borderRadius: '14px', padding: '3rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ color: '#6b7280', margin: 0 }}>
                    Selecciona un paciente desde la sección <strong>Pacientes</strong> para consultar su historial.
                </p>
            </div>
        </div>
    );

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#6b7280' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <p>Cargando historial clínico...</p>
            </div>
        </div>
    );

    const pac = expediente?.paciente || expediente;
    const antecedentes = expediente?.antecedentes;
    const triajes = expediente?.triajes || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: '#033323', fontWeight: 700 }}>📋 Historial Clínico</h1>

            {/* Banner paciente */}
            {pac && (
                <div style={{ background: 'linear-gradient(135deg,#033323,#0d9488)', borderRadius: '14px', padding: '1.5rem 2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, flexShrink: 0 }}>
                        {(pac.nombres?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{pac.apellidoPaterno} {pac.apellidoMaterno}, {pac.nombres}</h2>
                        <p style={{ margin: '0.2rem 0 0', opacity: 0.85, fontSize: '0.85rem' }}>
                            DNI: {pac.dni} · Sexo: {pac.sexo} · Seguro: {pac.tipoSeguro || '—'}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                    { id: 'antecedentes', label: '🗂️ Antecedentes' },
                    { id: 'triajes', label: `🩺 Triajes (${triajes.length})` },
                    { id: 'consultas', label: `📄 Consultas (${historial.length})` },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        padding: '0.55rem 1.1rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: tab === t.id ? '#033323' : '#f3f4f6',
                        color: tab === t.id ? '#fff' : '#374151',
                        transition: 'all 0.15s'
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Contenido tab */}
            <div style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>

                {tab === 'antecedentes' && (
                    antecedentes ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
                            <InfoCard titulo="⚠️ Alergias" valor={antecedentes.alergias || 'Ninguna'} alerta={antecedentes.alergias && antecedentes.alergias !== 'Ninguna conocida'} />
                            <InfoCard titulo="🏥 Enfermedades Crónicas" valor={antecedentes.enfCronicas || '—'} />
                            <InfoCard titulo="💊 Medicación Habitual" valor={antecedentes.medicacionHabitual || '—'} />
                            <InfoCard titulo="🔪 Cirugías Previas" valor={antecedentes.cirugias || '—'} />
                        </div>
                    ) : <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Sin antecedentes registrados.</p>
                )}

                {tab === 'triajes' && (
                    triajes.length === 0 ? (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>No hay triajes registrados.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {triajes.map((t, i) => (
                                <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <span style={{ fontWeight: 700, color: '#033323' }}>Triaje #{i + 1}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                            {t.fechaTriaje ? new Date(t.fechaTriaje).toLocaleString('es-PE') : '—'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '0.5rem' }}>
                                        <Vital label="PA" valor={`${t.paSistolica}/${t.paDiastolica} mmHg`} />
                                        <Vital label="FC" valor={`${t.frecCardiaca} bpm`} />
                                        <Vital label="Temp" valor={`${t.temperatura} °C`} />
                                        <Vital label="SpO₂" valor={`${t.saturacionO2}%`} />
                                        <Vital label="Peso" valor={`${t.pesoKg} kg`} />
                                        <Vital label="Talla" valor={`${t.tallaCm} cm`} />
                                    </div>
                                    {t.prioridad && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <span style={prioridadBadge(t.prioridad)}>{t.prioridad}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                )}

                {tab === 'consultas' && (
                    historial.length === 0 ? (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Sin consultas previas registradas.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {historial.map((c, i) => (
                                <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                        <span style={{ background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.82rem', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                                            CIE-10: {c.diagnosticoCie10 || c.codigoCie10 || '—'}
                                        </span>
                                        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                                            {c.fechaConsulta ? new Date(c.fechaConsulta).toLocaleDateString('es-PE') : '—'}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#111827' }}>
                                        {c.diagnosticoDesc || c.descripcionDiagnostico || '—'}
                                    </p>
                                    {(c.motivo || c.anamnesis) && (
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                                            {c.motivo || c.anamnesis}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function InfoCard({ titulo, valor, alerta }) {
    return (
        <div style={{ background: alerta ? '#fef2f2' : '#f9fafb', borderRadius: '10px', padding: '1rem', border: `1px solid ${alerta ? '#fecaca' : '#e5e7eb'}` }}>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: 700, color: alerta ? '#b91c1c' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{titulo}</p>
            <p style={{ margin: 0, color: alerta ? '#7f1d1d' : '#111827', fontSize: '0.88rem', lineHeight: 1.5 }}>{valor}</p>
        </div>
    );
}

function Vital({ label, valor }) {
    return (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, marginBottom: '0.15rem' }}>{label}</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>{valor}</div>
        </div>
    );
}

function prioridadBadge(p) {
    const map = { NORMAL: ['#d1fae5','#065f46'], URGENTE: ['#fef3c7','#92400e'], CRITICO: ['#fee2e2','#7f1d1d'] };
    const [bg, color] = map[p] || map['NORMAL'];
    return { background: bg, color, fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '20px', display: 'inline-block' };
}