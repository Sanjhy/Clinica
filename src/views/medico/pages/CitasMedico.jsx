import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Medico.module.css';

export default function CitasMedico({ user, onNavegar }) {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                if (user?.accessToken) {
                    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
                    const res = await axios.get('http://localhost:8080/api/medico/citas', config);
                    setCitas(res.data || []);
                }
            } catch (error) {
                console.error("Error obteniendo citas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCitas();
    }, [user]);

    const cambiarEstado = async (codCita, nuevoEstado) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            await axios.patch(`http://localhost:8080/api/medico/citas/${codCita}/estado`, { estado: nuevoEstado }, config);
            setCitas(citas.map(c => c.codCita === codCita ? { ...c, estado: nuevoEstado } : c));
        } catch (error) {
            alert('Error al actualizar la cita');
        }
    };

    const citasActivas = citas.filter(c => c.estado !== 'COMPLETADA' && c.estado !== 'CANCELADA');

    return (
        <div className={styles.formSection}>
            <h2 className={styles.title} style={{ marginBottom: '1.5rem' }}>Mi Agenda de Citas</h2>
            
            {loading ? (
                <p>Consultando calendario clínico local...</p>
            ) : citasActivas.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#777777' }}>No hay citas pendientes.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {citasActivas.map((c, index) => {
                        const esHoy = new Date(c.fechaHora).toDateString() === new Date().toDateString();
                        return (
                            <div key={c.codCita || index} className={styles.card} style={{ padding: '1rem', background: esHoy ? '#f8fafc' : '#ffffff', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '1.05rem', color: '#033323' }}>
                                        {c.pacienteNombreCompleto}
                                    </strong>
                                    <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                                        DNI: {c.dniPaciente} | ⏰ {new Date(c.fechaHora).toLocaleString()} | ⏳ {c.duracionMin} min
                                    </span>
                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#374151' }}>
                                        📝 Motivo: {c.motivo || 'Sin motivo especificado'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span className={c.estado === 'PENDIENTE' ? styles.badgePendiente : styles.badgeConfirmada}>
                                        {c.estado}
                                    </span>
                                    <select 
                                        value={c.estado}
                                        onChange={(e) => cambiarEstado(c.codCita, e.target.value)}
                                        className={styles.input}
                                        style={{ padding: '0.4rem', width: 'auto' }}
                                    >
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="CONFIRMADA">Confirmada</option>
                                        <option value="COMPLETADA">Marcar como Completada</option>
                                        <option value="CANCELADA">Cancelar</option>
                                    </select>
                                    <button
                                        onClick={() => onNavegar && onNavegar('triaje')}
                                        className={styles.btnAction}
                                    >
                                        📝 Atender
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}