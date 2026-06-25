import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePacientesMedico } from '../hooks/usePacientesMedico';
import styles from '../styles/Medico.module.css';

export default function PacienteMedico({ user, onNavegar }) {
    const { pacientes, busqueda, setBusqueda, loading } = usePacientesMedico(user?.accessToken);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [atendidosIds, setAtendidosIds] = useState(new Set());
    const [historial, setHistorial] = useState([]);
    const [loadingHistorial, setLoadingHistorial] = useState(false);

    useEffect(() => {
        if (user?.accessToken) {
            fetch('http://localhost:8080/api/medico/recetas', { headers: { Authorization: `Bearer ${user.accessToken}` } })
                .then(res => res.json())
                .then(data => {
                    const ids = new Set(data.map(r => r.dniPaciente));
                    setAtendidosIds(ids);
                })
                .catch(e => console.error(e));
        }
    }, [user]);

    const cargarHistorial = async (p) => {
        setPacienteSeleccionado(p);
        setLoadingHistorial(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/medico/consultas/historial/${p.codPaciente}`, {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            });
            setHistorial(res.data || []);
        } catch (e) {
            console.error('Error al cargar historial', e);
        } finally {
            setLoadingHistorial(false);
        }
    };

    const pacientesAtendidos = pacientes.filter(p => atendidosIds.has(p.dni));

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    if (pacienteSeleccionado) {
        return (
            <div className={styles.container}>
                <button onClick={() => setPacienteSeleccionado(null)} className={styles.btnPrimary} style={{ marginBottom: '1rem', backgroundColor: '#4b5563' }}>
                    ← Volver a Pacientes Atendidos
                </button>
                
                <div className={styles.formSection} style={{ marginBottom: '1.5rem' }}>
                    <h2 className={styles.title} style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                        Historial Médico: {pacienteSeleccionado.nombreCompleto || `${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidoPaterno}`}
                    </h2>
                    <p style={{ margin: 0, color: '#4b5563' }}>
                        DNI: <strong>{pacienteSeleccionado.dni}</strong> | Edad: <strong>{pacienteSeleccionado.fechaNacimiento ? calcularEdad(pacienteSeleccionado.fechaNacimiento) : '-'} años</strong> | Sexo: <strong>{pacienteSeleccionado.sexo}</strong>
                    </p>
                </div>

                {loadingHistorial ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Cargando historial completo...</div>
                ) : historial.length === 0 ? (
                    <div className={styles.formSection} style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                        No hay atenciones médicas registradas para este paciente.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {historial.map((consulta) => (
                            <div key={consulta.codConsulta} className={styles.formSection} style={{ borderLeft: '4px solid #033323', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.25rem 0', color: '#111827', fontSize: '1.15rem' }}>Consulta de {consulta.tipoConsulta}</h3>
                                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{new Date(consulta.fechaConsulta).toLocaleString()}</p>
                                    </div>
                                    <span className={styles.badgeConfirmada}>COMPLETADA</span>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.95rem' }}>📌 Motivo</h4>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>{consulta.motivo || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.95rem' }}>🩺 Examen Físico</h4>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>{consulta.examenFisico || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.95rem' }}>⚕️ Diagnóstico</h4>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>
                                            <strong>{consulta.diagnosticoCie10 ? `[${consulta.diagnosticoCie10}] ` : ''}</strong>
                                            {consulta.diagnosticoDesc || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.95rem' }}>📝 Evolución / Indicaciones</h4>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>
                                            <strong>Evolución:</strong> {consulta.evolucion || '-'}<br/><br/>
                                            <strong>Indicaciones:</strong> {consulta.indicaciones || '-'}
                                        </p>
                                    </div>
                                </div>
                                
                                {consulta.receta && (
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #e5e7eb' }}>
                                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#033323', fontSize: '1rem' }}>💊 Receta Emitida</h4>
                                        <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                            {consulta.receta.medicamentos && consulta.receta.medicamentos.length > 0 ? (
                                                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#065f46', fontSize: '0.9rem' }}>
                                                    {consulta.receta.medicamentos.map(m => (
                                                        <li key={m.id || Math.random()} style={{ marginBottom: '0.5rem' }}>
                                                            <strong>{m.medicamento}</strong> - {m.dosis} | {m.frecuencia} por {m.duracion} (Cantidad: {m.cantidad})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p style={{ margin: 0, color: '#065f46', fontSize: '0.9rem' }}>Receta sin medicamentos detallados.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className={styles.title}>Historial de Pacientes Atendidos</h1>
                <p className={styles.subtitle}>
                    {pacientesAtendidos.length} paciente{pacientesAtendidos.length !== 1 ? 's' : ''} en su historial
                </p>
            </div>

            <div className={styles.tableContainer} style={{ padding: '1rem' }}>
                <input
                    type="text"
                    placeholder="Buscar paciente por nombre o DNI..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.input}
                    style={{ marginBottom: '1rem' }}
                />

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Paciente</th>
                                <th className={styles.th}>DNI</th>
                                <th className={styles.th}>Edad/Sexo</th>
                                <th className={styles.th}>Contacto</th>
                                <th className={styles.th} style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className={styles.td} style={{ textAlign: 'center' }}>⏳ Cargando pacientes...</td></tr>
                            ) : pacientesAtendidos.length === 0 ? (
                                <tr><td colSpan="5" className={styles.td} style={{ textAlign: 'center' }}>No hay pacientes en su historial de atendidos.</td></tr>
                            ) : (
                                pacientesAtendidos.map((p) => {
                                    const nombre = p.nombreCompleto || `${p.nombres || ''} ${p.apellidoPaterno || ''}`.trim();
                                    const edad = p.edad ?? (p.fechaNacimiento ? calcularEdad(p.fechaNacimiento) : '-');
                                    const sexo = p.sexo === 'M' ? 'Masc.' : p.sexo === 'F' ? 'Fem.' : (p.sexo || '-');
                                    
                                    return (
                                        <tr key={p.codPaciente}>
                                            <td className={styles.td} style={{ fontWeight: 600 }}>{nombre}</td>
                                            <td className={styles.td}>{p.dni}</td>
                                            <td className={styles.td}>{edad} años / {sexo}</td>
                                            <td className={styles.td}>{p.telefono || p.email || '-'}</td>
                                            <td className={styles.td} style={{ textAlign: 'center' }}>
                                                <button
                                                    onClick={() => cargarHistorial(p)}
                                                    className={styles.btnAction}
                                                >
                                                    Ver
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