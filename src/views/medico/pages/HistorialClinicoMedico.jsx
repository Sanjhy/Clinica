import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/HistorialClinicoMedico.module.css';

export default function HistorialClinicoMedico({ citaId = 1 }) {
    const [anamnesis, setAnamnesis] = useState('');
    const [cie10, setCie10] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);
        try {
            const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
            const config = { headers: { Authorization: `Bearer ${session.accessToken}` } };

            await axios.post('http://localhost:8080/api/medico/atencion/guardar', {
                citaId: citaId,
                anamnesis: anamnesis,
                codigoCie10: cie10,
                descripcionDiagnostico: diagnostico
            }, config);

            setMensaje('✓ Acto médico y diagnóstico guardados en la Historia Clínica del paciente.');
        } catch (err) {
            console.error(err);
            setMensaje('❌ Error al procesar el cierre de la consulta.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className={styles.evolucionContainer} style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e5e0' }}>
            <h2 style={{ marginTop: 0, color: '#033323', fontSize: '1.25rem', borderBottom: '2px solid #033323', paddingBottom: '0.5rem' }}>Ficha de Atención Médica Activa</h2>
            
            {mensaje && <div style={{ padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', backgroundColor: mensaje.startsWith('✓') ? '#d1fae5' : '#fef2f2', color: mensaje.startsWith('✓') ? '#065f46' : '#991b1b', fontWeight: '600' }}>{mensaje}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Anamnesis y Evolución Clínica</label>
                    <textarea 
                        className={styles.textareaClinico}
                        rows="5"
                        placeholder="Escriba los síntomas, examen físico y observaciones aquí..."
                        value={anamnesis}
                        onChange={(e) => setAnamnesis(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #dcdbd6', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Código CIE-10</label>
                        <input type="text" placeholder="Ej: I10" value={cie10} onChange={(e) => setCie10(e.target.value)} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #dcdbd6', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Diagnóstico Definitivo</label>
                        <input type="text" placeholder="Ej: Hipertensión Esencial" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #dcdbd6', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>
                </div>

                <button type="submit" disabled={guardando} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#033323', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    {guardando ? 'Guardando en Servidor...' : '📁 Registrar Consulta'}
                </button>
            </form>
        </div>
    );
}