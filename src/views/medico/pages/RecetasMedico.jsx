import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Medico.module.css';

export default function RecetasMedico({ user }) {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const token = user?.accessToken;
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:8080/api/medico/recetas', config);
                setRecetas(res.data || []);
            } catch (err) {
                console.error("Error al recuperar recetas:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecetas();
    }, [user]);

    return (
        <div className={styles.tableContainer} style={{ padding: '1.5rem' }}>
            <h2 className={styles.title} style={{ marginBottom: '1.5rem' }}>Historial de Recetas Emitidas</h2>
            
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Paciente</th>
                            <th className={styles.th}>DNI</th>
                            <th className={styles.th}>Fecha Emisión</th>
                            <th className={styles.th}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className={styles.td} style={{ textAlign: 'center' }}>Cargando recetas...</td></tr>
                        ) : recetas.length === 0 ? (
                            <tr><td colSpan="4" className={styles.td} style={{ textAlign: 'center', fontStyle: 'italic', color: '#777777' }}>No ha emitido recetas aún.</td></tr>
                        ) : (
                            recetas.map((r) => (
                                <tr key={r.codReceta}>
                                    <td className={styles.td} style={{ fontWeight: '600' }}>{r.pacienteNombreCompleto}</td>
                                    <td className={styles.td}>{r.dniPaciente}</td>
                                    <td className={styles.td}>{new Date(r.fechaEmision).toLocaleString()}</td>
                                    <td className={styles.td}>
                                        <span className={styles.badgeConfirmada}>
                                            {r.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#6b7280' }}>* Las recetas nuevas se emiten directamente al registrar la Consulta Médica en la sección de Historia Clínica.</p>
        </div>
    );
}