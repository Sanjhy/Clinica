import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

const calcularEdad = (fechaNac) => {
    if (!fechaNac) return '?';
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
};

export default function DashboardEnfermera({ user, onAccion }) {
    const [pacientes, setPacientes] = useState([]);
    const [triajes, setTriajes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.accessToken) return;
        const cfg = { headers: { Authorization: `Bearer ${user.accessToken}` } };
        Promise.all([
            axios.get(`${API}/api/pacientes`, cfg).catch(() => ({ data: [] })),
        ]).then(([resPac]) => {
            setPacientes(resPac.data || []);
        }).finally(() => setLoading(false));
    }, [user]);

    const totalPacientes = pacientes.length;
    const nombre = user?.nombreCompleto || 'Enfermera';
    const hora = new Date().getHours();
    const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6b7280' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <p>Cargando datos del turno...</p>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Saludo */}
            <div style={{ background: 'linear-gradient(135deg,#033323,#0d9488)', borderRadius: '16px', padding: '1.75rem 2rem', color: '#fff' }}>
                <h1 style={{ margin: '0 0 0.25rem', fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 700 }}>
                    {saludo}, {nombre.split(' ')[0]} 👋
                </h1>
                <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
                    Panel de Enfermería · CAM Pucallpa · {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long' })}
                </p>
            </div>

            {/* Tarjetas resumen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <Metrica icon="👥" label="Pacientes activos" valor={totalPacientes} color="#0d9488" />
                <Metrica icon="🩺" label="Triajes hoy" valor={triajes.length} color="#2563eb" />
                <Metrica icon="⏳" label="En espera" valor={totalPacientes} color="#d97706" />
                <Metrica icon="🚨" label="Casos urgentes" valor={0} color="#dc2626" />
            </div>

            {/* Lista de pacientes del día */}
            <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#033323' }}>
                        📋 Pacientes asignados al turno
                    </h2>
                    <span style={badge('#f0fdf4', '#065f46')}>{totalPacientes} registrados</span>
                </div>
                {pacientes.length === 0 ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>No hay pacientes asignados.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tbl}>
                            <thead>
                                <tr>
                                    {['Paciente', 'DNI', 'Edad', 'Seguro', 'Médico asignado', 'Acciones'].map(h => (
                                        <th key={h} style={th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map(p => (
                                    <tr key={p.codPaciente} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ ...td, fontWeight: 600 }}>
                                            {p.apellidoPaterno} {p.apellidoMaterno}, {p.nombres}
                                        </td>
                                        <td style={{ ...td, fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.dni}</td>
                                        <td style={td}>{calcularEdad(p.fechaNacimiento)} años</td>
                                        <td style={td}>
                                            <span style={badge('#eff6ff', '#1d4ed8')}>{p.tipoSeguro || 'SIS'}</span>
                                        </td>
                                        <td style={{ ...td, fontSize: '0.85rem', color: '#6b7280' }}>
                                            {p.medicoAsignadoNombre || '—'}
                                        </td>
                                        <td style={td}>
                                            <button
                                                onClick={() => onAccion(p.codPaciente, null)}
                                                style={btnGreen}
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

function Metrica({ icon, label, valor, color }) {
    return (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color, lineHeight: 1 }}>{valor}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>{label}</div>
        </div>
    );
}

const card = { background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const tbl = { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' };
const th = { textAlign: 'left', padding: '0.65rem 0.75rem', background: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' };
const td = { padding: '0.75rem', color: '#111827' };
const btnGreen = { padding: '0.35rem 0.85rem', background: '#033323', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' };
const badge = (bg, color) => ({ background: bg, color, fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '20px', display: 'inline-block' });