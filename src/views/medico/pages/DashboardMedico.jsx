import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardMedico({ user, onNavegar }) {
    const [medicoInfo, setMedicoInfo] = useState(null);
    const [citasHoy, setCitasHoy] = useState([]);
    const [metricas, setMetricas] = useState({ total: 0, espera: 0, atendidos: 0, urgentes: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const obtenerFechaElegante = () => {
        return new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true);
                const token = user?.accessToken;
                if (!token) { setError('Sin sesión activa.'); setLoading(false); return; }

                const cfg = { headers: { Authorization: `Bearer ${token}` } };

                // Cargar perfil del médico
                try {
                    const r = await axios.get('http://localhost:8080/api/pacientes', cfg);
                    // Usamos la lista de pacientes como proxy de citas del día
                    const lista = r.data || [];
                    setCitasHoy(lista);
                    setMetricas({
                        total: lista.length,
                        espera: lista.filter(p => p.activo).length,
                        atendidos: 0,
                        urgentes: 0
                    });
                } catch { /* endpoint puede no existir aún */ }

                // Datos del médico desde la sesión
                setMedicoInfo({
                    nombreCompleto: user?.nombreCompleto || '',
                    especialidad: user?.especialidad || 'Medicina General'
                });

                setError(null);
            } catch (err) {
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };
        if (user !== null) cargar();
    }, [user]);

    const cardStyle = (color = '#033323') => ({
        background: '#ffffff',
        padding: '1.5rem',
        borderRadius: '14px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    });

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#033323', fontWeight: 600 }}>
            🔄 Conectando con el servidor...
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Encabezado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', color: '#033323', fontWeight: 700 }}>
                        Bienvenido, {medicoInfo?.nombreCompleto ? `Dr. ${medicoInfo.nombreCompleto.split(' ')[1] || medicoInfo.nombreCompleto}` : 'Doctor'}
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                        {medicoInfo?.especialidad} · {obtenerFechaElegante()}
                    </p>
                </div>
                <button
                    onClick={() => onNavegar && onNavegar('pacientes')}
                    style={{ background: '#033323', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                    Ver pacientes →
                </button>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Tarjetas de métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={cardStyle()}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Pacientes totales</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#033323' }}>{metricas.total}</p>
                </div>
                <div style={cardStyle()}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Activos</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#d97706' }}>{metricas.espera}</p>
                </div>
                <div style={cardStyle()}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Atendidos hoy</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#16a34a' }}>{metricas.atendidos}</p>
                </div>
                <div style={{ ...cardStyle(), background: '#fef2f2', border: '1px solid #fee2e2' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Urgencias</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#dc2626' }}>{metricas.urgentes}</p>
                </div>
            </div>

            {/* Tabla de pacientes recientes */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>Pacientes registrados</h2>
                    <button onClick={() => onNavegar && onNavegar('pacientes')} style={{ background: 'transparent', border: 'none', color: '#0d9488', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                        Ver todos →
                    </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>Nombre</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>DNI</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>Seguro</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citasHoy.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No hay pacientes registrados aún.</td></tr>
                            ) : (
                                citasHoy.slice(0, 5).map((p, i) => (
                                    <tr key={p.codPaciente || i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#111827' }}>{p.nombreCompleto || `${p.nombres} ${p.apellidoPaterno}`}</td>
                                        <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#374151' }}>{p.dni}</td>
                                        <td style={{ padding: '0.85rem 1rem', color: '#374151' }}>{p.tipoSeguroNombre || '-'}</td>
                                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => onNavegar && onNavegar('pacientes')}
                                                style={{ background: '#ecfdf5', color: '#065f46', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                                            >
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}