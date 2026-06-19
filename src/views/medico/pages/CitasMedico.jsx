import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CitasMedico() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
                const config = { headers: { Authorization: `Bearer ${session.accessToken}` } };
                const res = await axios.get('http://localhost:8080/api/medico/citas/hoy', config);
                setCitas(res.data || []);
            } catch (err) {
                console.error("Error al recuperar citas de la BD:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCitas();
    }, []);

    return (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e5e0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#033323', fontSize: '1.25rem' }}>Agenda de Citas del Día</h2>
            {loading ? <p>Consultando calendario clínico local...</p> : citas.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#777777' }}>No hay citas agendadas para hoy.</p>
            ) : (
                citas.map((c, index) => (
                    <div key={c.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '0.75rem' }}>
                        <div>
                            <strong style={{ color: '#033323' }}>{c.hora || 'Turno programado'}</strong>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>Paciente: {c.paciente?.nombre} {c.paciente?.apellidoPaterno}</p>
                        </div>
                        <span style={{ fontSize: '0.8rem', background: '#e6f7f0', color: '#16a34a', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>CONFIRMADA</span>
                    </div>
                ))
            )}
        </div>
    );
}