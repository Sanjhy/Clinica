import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

const ESTADOS = ['PROGRAMADA', 'EN_CURSO', 'ATENDIDA', 'CANCELADA'];
const estadoStyle = {
    PROGRAMADA: { bg: '#eff6ff', color: '#1d4ed8' },
    EN_CURSO:   { bg: '#fef3c7', color: '#92400e' },
    ATENDIDA:   { bg: '#f0fdf4', color: '#065f46' },
    CANCELADA:  { bg: '#fef2f2', color: '#b91c1c' },
};

export default function CitasEnfermera({ user, onHacerTriaje }) {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        if (!user?.accessToken) return;
        const cfg = { headers: { Authorization: `Bearer ${user.accessToken}` } };
        axios.get(`${API}/api/pacientes`, cfg)
            .then(r => setPacientes(r.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: '#033323', fontWeight: 700 }}>📅 Citas del Día</h1>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                    Tablero diario · {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Stats rápidas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.75rem' }}>
                {[
                    { label: 'Total', valor: pacientes.length, color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Pendientes', valor: pacientes.length, color: '#d97706', bg: '#fef3c7' },
                    { label: 'Atendidas', valor: 0, color: '#16a34a', bg: '#f0fdf4' },
                    { label: 'Urgentes', valor: 0, color: '#dc2626', bg: '#fef2f2' },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.valor}</div>
                        <div style={{ fontSize: '0.78rem', color: s.color, fontWeight: 600 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tablero de pacientes/citas */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#033323' }}>Pacientes programados</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Actualizado: {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {loading ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: '#9ca3af' }}>Cargando citas...</div>
                ) : pacientes.length === 0 ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                        <p>No hay citas programadas para hoy.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb' }}>
                                    {['#', 'Paciente', 'DNI', 'Médico Asignado', 'Seguro', 'Estado', 'Acción'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', padding: '0.7rem 0.9rem', color: '#6b7280', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map((p, i) => (
                                    <tr key={p.codPaciente} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '0.85rem 0.9rem', color: '#9ca3af', fontSize: '0.82rem' }}>{String(i + 1).padStart(2, '0')}</td>
                                        <td style={{ padding: '0.85rem 0.9rem', fontWeight: 600, color: '#111827' }}>
                                            {p.apellidoPaterno} {p.apellidoMaterno}, {p.nombres}
                                        </td>
                                        <td style={{ padding: '0.85rem 0.9rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#374151' }}>{p.dni}</td>
                                        <td style={{ padding: '0.85rem 0.9rem', fontSize: '0.85rem', color: '#6b7280' }}>
                                            {p.medicoAsignadoNombre || '—'}
                                        </td>
                                        <td style={{ padding: '0.85rem 0.9rem' }}>
                                            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '20px' }}>
                                                {p.tipoSeguro || 'SIS'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 0.9rem' }}>
                                            <span style={{ ...estadoStyle['PROGRAMADA'], fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '20px', display: 'inline-block' }}>
                                                PROGRAMADA
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 0.9rem' }}>
                                            <button
                                                onClick={() => onHacerTriaje(p.codPaciente, null)}
                                                style={{ background: '#0d9488', color: '#fff', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                                            >
                                                Triaje
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}