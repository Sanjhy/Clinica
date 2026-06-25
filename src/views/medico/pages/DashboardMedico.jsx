import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Medico.module.css';

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

                try {
                    const rPacientes = await axios.get('http://localhost:8080/api/medico/pacientes', cfg);
                    const listaPacientes = rPacientes.data || [];

                    const rCitas = await axios.get('http://localhost:8080/api/medico/citas', cfg);
                    const citas = rCitas.data || [];
                    
                    const citasPendientes = citas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA');
                    setCitasHoy(citasPendientes); 

                    const rRecetas = await axios.get('http://localhost:8080/api/medico/recetas', cfg);
                    const recetas = rRecetas.data || [];
                    const atendidos = new Set(recetas.map(r => r.dniPaciente)).size; // Pacientes únicos atendidos
                    const enEspera = citasPendientes.length;
                    
                    setMetricas({
                        total: listaPacientes.length,
                        espera: enEspera,
                        atendidos: atendidos,
                        urgentes: 0
                    });
                } catch (e) {
                    console.error("Error cargando dashboard:", e);
                    setError('Fallo al obtener los indicadores. Revise la consola.');
                }

                setMedicoInfo({
                    nombreCompleto: user?.nombreCompleto || '',
                    especialidad: user?.especialidad || 'Medicina General'
                });

            } catch (err) {
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };
        if (user !== null) cargar();
    }, [user]);

    if (loading) return (
        <div className={styles.container}>
            🔄 Conectando con el servidor...
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        Bienvenido, {medicoInfo?.nombreCompleto ? `Dr. ${medicoInfo.nombreCompleto.split(' ')[1] || medicoInfo.nombreCompleto}` : 'Doctor'}
                    </h1>
                    <p className={styles.subtitle}>
                        {medicoInfo?.especialidad} · {obtenerFechaElegante()}
                    </p>
                </div>
                <button
                    onClick={() => onNavegar && onNavegar('citas')}
                    className={styles.btnPrimary}
                >
                    Ver agenda de hoy →
                </button>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    ⚠️ {error}
                </div>
            )}

            {/* Welcome Banner Minimal */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(0, 167, 111, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
                backgroundColor: '#c8fad6',
                borderRadius: '16px',
                padding: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#004B50',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 800, color: '#004b50' }}>
                        ¡Bienvenido de vuelta,<br /> Dr. {medicoInfo?.nombreCompleto?.split(' ')[1] || medicoInfo?.nombreCompleto?.split(' ')[0] || 'Doctor'}! 👋
                    </h1>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem', maxWidth: '400px', lineHeight: 1.5 }}>
                        Si vas a usar el sistema para revisar historiales, asegúrate de tener las herramientas listas. ¡Que tengas un excelente turno!
                    </p>
                    <button onClick={() => onNavegar('pacientes')} style={{ 
                        marginTop: '1.5rem', background: '#00A76F', color: '#fff', border: 'none', 
                        padding: '0.65rem 1.2rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)'
                    }}>
                        Ver mis pacientes
                    </button>
                </div>
                <div style={{ fontSize: '6rem', opacity: 0.8, marginRight: '2rem' }}>🧑‍⚕️</div>
            </div>

            {/* Tarjetas resumen Minimal */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Metrica icon="👥" label="Pacientes hoy" valor={metricas.total} />
                <Metrica icon="📝" label="Triajes en espera" valor={metricas.espera} />
                <Metrica icon="🚨" label="Urgencias" valor={metricas.urgentes} isAlert />
                <Metrica icon="💬" label="Mensajes sin leer" valor={0} />
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Agenda de Hoy</h2>
                    <button onClick={() => onNavegar && onNavegar('citas')} className={styles.btnLink}>
                        Ver todas las citas →
                    </button>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Hora</th>
                                <th className={styles.th}>Paciente</th>
                                <th className={styles.th}>Estado</th>
                                <th className={styles.th} style={{ textAlign: 'center' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citasHoy.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className={styles.td} style={{ textAlign: 'center' }}>
                                        No hay pacientes agendados.
                                    </td>
                                </tr>
                            ) : (
                                citasHoy.slice(0, 5).map((c, i) => (
                                    <tr key={c.codCita || i}>
                                        <td className={styles.td}>
                                            {new Date(c.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className={styles.td}>
                                            {c.pacienteNombreCompleto} <br/>
                                            <span style={{fontSize: '0.75rem', color: '#6b7280'}}>DNI: {c.dniPaciente}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={c.estado === 'COMPLETADA' ? styles.badgeCompletada : c.estado === 'PENDIENTE' ? styles.badgePendiente : styles.badgeConfirmada}>
                                                {c.estado}
                                            </span>
                                        </td>
                                        <td className={styles.td} style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => onNavegar && onNavegar('triaje')}
                                                className={styles.btnAction}
                                            >
                                                Atender
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

function Metrica({ icon, label, valor, isAlert }) {
    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)',
            borderLeft: isAlert ? '4px solid #FF5630' : 'none'
        }}>
            <div style={{
                background: isAlert ? 'rgba(255, 86, 48, 0.16)' : 'rgba(0, 167, 111, 0.16)',
                color: isAlert ? '#FF5630' : '#00A76F',
                width: '60px', height: '60px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem'
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: '#212B36' }}>{valor}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#637381', fontWeight: 600 }}>{label}</p>
            </div>
        </div>
    );
}