import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificacionesMedico() {
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
                const config = { headers: { Authorization: `Bearer ${session.accessToken}` } };
                const res = await axios.get('http://localhost:8080/api/medico/triaje/hoy', config);
                
                // Mapeamos los triajes con presión arterial alta para simular alertas críticas en la LAN
                const criticos = (res.data || []).filter(t => t.prioridad === 'URGENTE');
                setAlertas(criticos);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlertas();
    }, []);

    return (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e5e0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#033323', fontSize: '1.25rem' }}>Bandeja de Notificaciones del Sistema</h2>
            {loading ? <p>Escuchando red LAN...</p> : alertas.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#777777' }}>🟢 Sin alertas críticas de Triaje en la sala de espera.</p>
            ) : (
                alertas.map((a, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #dc2626', borderRadius: '0 8px 8px 0', marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#991b1b' }}>⚠️ ALERTA DE TRIAJE CRÍTICO</strong>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#7f1d1d' }}>El paciente {a.paciente?.nombre} registra una Presión Arterial de {a.presionArterial}. Prioridad de atención urgente.</p>
                    </div>
                ))
            )}
        </div>
    );
}