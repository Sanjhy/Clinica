import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TriajeMedico() {
    const [listaTriaje, setListaTriaje] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarTriajes = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
                const config = { headers: { Authorization: `Bearer ${session.accessToken}` } };
                const res = await axios.get('http://localhost:8080/api/medico/triaje/hoy', config);
                setListaTriaje(res.data || []);
            } catch (err) {
                console.error("Error al traer triaje:", err);
            } {
                setLoading(false);
            }
        };
        cargarTriajes();
    }, []);

    return (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e5e0' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#033323' }}>Signos Vitales por Enfermería</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eaeaea', color: '#555555' }}>
                            <th style={{ padding: '0.75rem 1rem' }}>Paciente</th>
                            <th style={{ padding: '0.75rem 1rem' }}>P. Arterial</th>
                            <th style={{ padding: '0.75rem 1rem' }}>F. Cardíaca</th>
                            <th style={{ padding: '0.75rem 1rem' }}>Temp.</th>
                            <th style={{ padding: '0.75rem 1rem' }}>SatO₂</th>
                            <th style={{ padding: '0.75rem 1rem' }}>Peso/Talla</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '1.5rem', textAlign: 'center' }}>Cargando constantes...</td></tr>
                        ) : listaTriaje.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '1.5rem', textAlign: 'center', color: '#777777' }}>No hay signos vitales registrados en la LAN hoy.</td></tr>
                        ) : (
                            listaTriaje.map((t, idx) => (
                                <tr key={t.id || idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{t.paciente?.nombre} {t.paciente?.apellidoPaterno}</td>
                                    <td style={{ padding: '1rem', color: '#dc2626', fontWeight: '700' }}>{t.presionArterial}</td>
                                    <td style={{ padding: '1rem' }}>{t.frecuenciaCardiaca} bpm</td>
                                    <td style={{ padding: '1rem' }}>{t.temperatura} °C</td>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{t.saturacion}%</td>
                                    <td style={{ padding: '1rem' }}>{t.peso}kg / {t.talla}m</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}