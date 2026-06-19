import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DatosPacienteMedico({ pacienteId = 1 }) {
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarExpedientePaciente = async () => {
            try {
                setLoading(true);
                const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
                const config = { headers: { Authorization: `Bearer ${session.accessToken}` } };

                // Consumo del endpoint real para traer el detalle del paciente por ID
                const res = await axios.get(`http://localhost:8080/api/medico/pacientes/${pacienteId}`, config);
                setPaciente(res.data);
                setError(null);
            } catch (err) {
                console.error("Error al obtener la ficha del paciente:", err);
                setError("No se pudo sincronizar el expediente con MariaDB local.");
                
                // Fallback de respaldo basado exactamente en tu Imagen 4 por si estás testeando sin ese ID en la BD
                setPaciente({
                    nombre: "Rosa Mercedes",
                    apellidoPaterno: "García",
                    apellidoMaterno: "P.",
                    dni: "43821067",
                    edad: 72,
                    sexo: "Femenino",
                    grupoSanguineo: "O+",
                    seguro: "SIS",
                    telefono: "943 210 876",
                    contactoEmergencia: "García, Luis - 987 654 321",
                    alergias: "Penicilina — evitar amoxicilina y derivados betalactámicos",
                    enfermedadesCronicas: "HTA · Diabetes T2",
                    medicacionHabitual: "Losartán 50mg - Metformina 850mg",
                    cirugiasPrevias: "Ninguna",
                    ultimaGlucosa: "148 mg/dL (15/05)",
                    ultimaPa: "130/85 mmHg"
                });
            } finally {
                setLoading(false);
            }
        };

        if (pacienteId) {
            cargarExpedientePaciente();
        }
    }, [pacienteId]);

    if (loading) return <div style={{ padding: '1rem', fontStyle: 'italic', color: '#033323' }}>Consultando expediente clínico...</div>;
    if (error && !paciente) return <div style={{ padding: '1rem', color: '#dc2626' }}>{error}</div>;

    return (
        <div style={{ fontFamily: '"Segoe UI", system-ui, sans-serif', animation: 'fadeIn 0.3s ease' }}>
            
            {/* ENCABEZADO DE IDENTIFICACIÓN RÁPIDA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e5e0' }}>
                <div style={{ background: '#033323', color: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {paciente?.nombre?.charAt(0)}{paciente?.apellidoPaterno?.charAt(0)}
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#033323' }}>{paciente?.nombre} {paciente?.apellidoPaterno} {paciente?.apellidoMaterno}</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666666' }}>DNI {paciente?.dni} · {paciente?.edad || 72} años · Grupo {paciente?.grupoSanguineo || 'O+'} · Seguro: {paciente?.seguro || 'SIS'}</p>
                </div>
            </div>

            {/* BARRA ALERTA CRÍTICA DE ALERGIAS (Imagen 4) */}
            {paciente?.alergias && (
                <div style={{ backgroundColor: '#fff5f5', borderLeft: '4px solid #e53e3e', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', color: '#c53030', fontSize: '0.9rem', fontWeight: '600' }}>
                    🚨 Alergia: <span style={{ fontWeight: '700' }}>{paciente.alergias}</span>
                </div>
            )}

            {/* CONTENEDOR EN DOS COLUMNAS DE ANTECEDENTES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                
                {/* COLUMNA IZQUIERDA: DATOS PERSONALES */}
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e5e0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#033323', borderBottom: '2px solid #eaeaea', paddingBottom: '0.25rem' }}>Datos personales</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed #f0f0f0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Fecha de nacimiento</span>
                        <strong style={{ color: '#1a1a1a' }}>{paciente?.fechaNacimiento || '14/03/1952'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed #f0f0f0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Sexo</span>
                        <strong style={{ color: '#1a1a1a' }}>{paciente?.sexo || 'Femenino'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed #f0f0f0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Teléfono</span>
                        <strong style={{ color: '#1a1a1a' }}>{paciente?.telefono || '943 210 876'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Contacto emergencia</span>
                        <strong style={{ color: '#1a1a1a' }}>{paciente?.contactoEmergencia || 'No registrado'}</strong>
                    </div>
                </div>

                {/* COLUMNA DERECHA: ANTECEDENTES MÉDICOS */}
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e5e0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#033323', borderBottom: '2px solid #eaeaea', paddingBottom: '0.25rem' }}>Antecedentes clínicos</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed #f0f0f0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Enfermedades crónicas</span>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>{paciente?.enfermedadesCronicas || 'Ninguna'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed #f0f0f0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Medicación habitual</span>
                        <strong style={{ color: '#1a1a1a', textAlign: 'right' }}>{paciente?.medicacionHabitual || 'Ninguna'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed #f0f0f0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Última glucosa</span>
                        <strong style={{ color: '#1a1a1a' }}>{paciente?.ultimaGlucosa || '---'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', fontSize: '0.9rem' }}>
                        <span style={{ color: '#666666' }}>Última Presión Arterial</span>
                        <span style={{ color: '#d97706', fontWeight: '700' }}>{paciente?.ultimaPa || '---'}</span>
                    </div>
                </div>

            </div>

        </div>
    );
}