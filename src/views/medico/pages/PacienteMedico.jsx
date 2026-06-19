import React, { useState } from 'react';
import { usePacientesMedico } from '../hooks/usePacientesMedico';

export default function PacienteMedico({ user }) {
    const { pacientes, busqueda, setBusqueda, loading } = usePacientesMedico(user?.accessToken);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    if (pacienteSeleccionado) {
        return (
            <div>
                <button
                    onClick={() => setPacienteSeleccionado(null)}
                    style={{ marginBottom: '1.25rem', background: 'transparent', border: '1px solid #e5e7eb', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
                >
                    ← Volver a pacientes
                </button>
                <DetallesPaciente pacienteId={pacienteSeleccionado} token={user?.accessToken} />
            </div>
        );
    }

    return (
        <div>
            {/* Encabezado */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: '#033323', fontWeight: 700 }}>Mis Pacientes</h1>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''} encontrado{pacientes.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Buscador */}
            <div style={{ marginBottom: '1.25rem' }}>
                <input
                    type="text"
                    placeholder="🔍  Buscar por nombre o DNI..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ width: '100%', maxWidth: '400px', padding: '0.65rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Tabla */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>Paciente</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>DNI</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>Edad / Sexo</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>Seguro</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#6b7280', fontWeight: 600 }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>⏳ Cargando pacientes...</td></tr>
                            ) : pacientes.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No se encontraron pacientes.</td></tr>
                            ) : (
                                pacientes.map((p) => {
                                    const nombre = p.nombreCompleto || `${p.nombres || ''} ${p.apellidoPaterno || ''}`.trim();
                                    const edad = p.edad ?? (p.fechaNacimiento ? calcularEdad(p.fechaNacimiento) : '-');
                                    const sexo = p.sexo === 'M' ? 'Masc.' : p.sexo === 'F' ? 'Fem.' : (p.sexo || '-');
                                    return (
                                        <tr key={p.codPaciente} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#111827' }}>{nombre}</td>
                                            <td style={{ padding: '0.9rem 1rem', fontFamily: 'monospace', color: '#374151' }}>{p.dni}</td>
                                            <td style={{ padding: '0.9rem 1rem', color: '#374151' }}>{edad} / {sexo}</td>
                                            <td style={{ padding: '0.9rem 1rem', color: '#374151' }}>{p.tipoSeguroNombre || '-'}</td>
                                            <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setPacienteSeleccionado(p.codPaciente)}
                                                    style={{ background: '#0d9488', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                                                >
                                                    Ver expediente
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) edad--;
    return edad;
}

// Componente inline para ver el expediente completo
function DetallesPaciente({ pacienteId, token }) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/pacientes/${pacienteId}/expediente`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error();
                setData(await res.json());
            } catch {
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [pacienteId, token]);

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>⏳ Cargando expediente...</div>;
    if (!data) return <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>⚠️ No se pudo cargar el expediente.</div>;

    const iniciales = data.nombreCompleto?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'PT';

    return (
        <div style={{ maxWidth: '1000px' }}>
            {/* Cabecera */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                        {iniciales}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#111827', fontWeight: 700 }}>{data.nombreCompleto}</h2>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                            DNI {data.dni} · {data.edad} años · {data.sexo === 'M' ? 'Masculino' : 'Femenino'} · {data.tipoSeguroNombre}
                        </p>
                    </div>
                </div>
            </div>

            {/* Alerta alergia */}
            {data.alergias && !['ninguna', 'ninguna registrada', 'ninguna conocida'].includes(data.alergias.toLowerCase()) && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #dc2626', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#b91c1c', fontSize: '0.9rem' }}>
                    <strong>⚠️ Alergias:</strong> {data.alergias}
                </div>
            )}

            {/* Grid de datos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* Datos personales */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#033323', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos personales</h3>
                    {[
                        ['Fecha de nac.', data.fechaNacimiento],
                        ['Teléfono', data.telefono || 'No registrado'],
                        ['Seguro', `${data.tipoSeguroNombre} ${data.numSeguro ? '- '+data.numSeguro : ''}`],
                        ['Contacto emerg.', data.contactoEmergencia || 'No registrado'],
                        ['Tel. emergencia', data.telEmergencia || '-'],
                    ].map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.87rem', gap: '1rem' }}>
                            <span style={{ color: '#6b7280', flexShrink: 0 }}>{label}</span>
                            <span style={{ color: '#111827', fontWeight: 500, textAlign: 'right' }}>{val}</span>
                        </div>
                    ))}
                </div>

                {/* Antecedentes */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#033323', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Antecedentes</h3>
                    {[
                        ['Enf. crónicas', data.enfCronicas],
                        ['Medicación', data.medicacionHabitual],
                        ['Cirugías', data.cirugias],
                        ['Última PA', data.ultimaPA],
                        ['Frec. cardíaca', data.ultimaFrecuenciaCardiaca],
                        ['Sat. O₂', data.ultimaSaturacionO2],
                    ].map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.87rem', gap: '1rem' }}>
                            <span style={{ color: '#6b7280', flexShrink: 0 }}>{label}</span>
                            <span style={{ color: '#111827', fontWeight: 500, textAlign: 'right' }}>{val || '-'}</span>
                        </div>
                    ))}
                </div>

                {/* Acciones rápidas */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#033323', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones rápidas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button style={{ padding: '0.7rem', background: '#0d9488', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            📋 Historia clínica
                        </button>
                        <button style={{ padding: '0.7rem', background: '#033323', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            💊 Emitir receta
                        </button>
                        <button style={{ padding: '0.7rem', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            🧪 Solicitar examen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}