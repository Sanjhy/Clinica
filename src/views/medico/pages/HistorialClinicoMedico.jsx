import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Medico.module.css';

export default function HistorialClinicoMedico({ user }) {
    const [listaTriajeCompleta, setListaTriajeCompleta] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const token = user?.accessToken;
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const resTAll = await axios.get('http://localhost:8080/api/medico/debug-triajes', config);
                const todosTriajes = resTAll.data || [];
                
                const listaT = [];
                for (const t of todosTriajes) {
                    const p = t.paciente;
                    if (p) {
                        listaT.push({ ...t, pacienteInfo: p });
                    }
                }
                
                listaT.sort((a, b) => new Date(b.fechaTriaje) - new Date(a.fechaTriaje));
                setListaTriajeCompleta(listaT);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, [user]);

    return (
        <div className={styles.tableContainer} style={{ padding: '1.5rem' }}>
            <h2 className={styles.title} style={{ marginBottom: '1rem' }}>
                Últimos Signos Vitales (Registrados por la Enfermera)
            </h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Paciente</th>
                            <th className={styles.th}>Fecha</th>
                            <th className={styles.th}>P. Arterial</th>
                            <th className={styles.th}>F. Cardíaca</th>
                            <th className={styles.th}>Temp.</th>
                            <th className={styles.th}>SatO₂</th>
                            <th className={styles.th}>Peso/Talla</th>
                            <th className={styles.th} style={{ textAlign: 'center' }}>Datos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" className={styles.td} style={{ textAlign: 'center' }}>Cargando constantes...</td></tr>
                        ) : listaTriajeCompleta.length === 0 ? (
                            <tr><td colSpan="8" className={styles.td} style={{ textAlign: 'center' }}>No hay signos vitales registrados para sus pacientes.</td></tr>
                        ) : (
                            listaTriajeCompleta.map((t, idx) => (
                                <tr key={t.codTriaje || idx}>
                                    <td className={styles.td} style={{ fontWeight: '600' }}>
                                        {t.pacienteInfo.nombreCompleto || `${t.pacienteInfo.nombres} ${t.pacienteInfo.apellidoPaterno}`}
                                    </td>
                                    <td className={styles.td}>{new Date(t.fechaTriaje).toLocaleString()}</td>
                                    <td className={styles.td}>
                                        <span className={styles.triajeValueDanger}>{t.paSistolica}/{t.paDiastolica}</span>
                                    </td>
                                    <td className={styles.td}>{t.frecCardiaca} lpm</td>
                                    <td className={styles.td}>{t.temperatura} °C</td>
                                    <td className={styles.td}>
                                        <span className={styles.triajeValueSuccess}>{t.saturacionO2}%</span>
                                    </td>
                                    <td className={styles.td}>{t.pesoKg}kg / {t.tallaCm}cm</td>
                                    <td className={styles.td} style={{ textAlign: 'center' }}>
                                        <button 
                                            type="button" 
                                            className={styles.btnAction} 
                                            onClick={() => alert(`Datos del Paciente:\nNombre: ${t.pacienteInfo.nombreCompleto || (t.pacienteInfo.nombres + ' ' + t.pacienteInfo.apellidoPaterno)}\nDNI: ${t.pacienteInfo.dni}\nSexo: ${t.pacienteInfo.sexo}\nTeléfono: ${t.pacienteInfo.telefono || '-'}\nEmail: ${t.pacienteInfo.email || '-'}`)}
                                        >
                                            Ver datos
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}