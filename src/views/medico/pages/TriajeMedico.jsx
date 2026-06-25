import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Medico.module.css';

export default function TriajeMedico({ user }) {
    const [pacientes, setPacientes] = useState([]);
    const [citasHoy, setCitasHoy] = useState([]);
    const [triajes, setTriajes] = useState({});
    const [inventario, setInventario] = useState([]);
    
    const [form, setForm] = useState({
        codPaciente: '',
        codCita: '',
        tipoConsulta: 'CONTROL',
        motivo: '',
        examenFisico: '',
        diagnosticoCie10: '',
        diagnosticoDesc: '',
        evolucion: '',
        indicaciones: '',
        medicamentos: []
    });

    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const token = user?.accessToken;
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const resCitas = await axios.get('http://localhost:8080/api/medico/citas', config);
                const citasPendientes = (resCitas.data || []).filter(c => 
                    (c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA')
                );
                setCitasHoy(citasPendientes);
                
                const resPacientes = await axios.get('http://localhost:8080/api/medico/pacientes', config);
                const listaPacientes = resPacientes.data || [];
                setPacientes(listaPacientes);

                const dictTriajes = {};
                try {
                    const resTAll = await axios.get('http://localhost:8080/api/medico/debug-triajes', config);
                    const todosTriajes = resTAll.data || [];
                    
                    for (const t of todosTriajes) {
                        const p = t.paciente;
                        if (p) {
                            dictTriajes[p.codPaciente] = t;
                        }
                    }
                } catch (e) { console.error("Error cargando triajes", e); }
                setTriajes(dictTriajes);

                try {
                    const resInv = await axios.get('http://localhost:8080/api/inventario', config);
                    setInventario(resInv.data || []);
                } catch (e) { console.error("Error cargando inventario", e); }

            } catch (err) {
                console.error(err);
            }
        };
        fetchDatos();
    }, [user]);

    const handleSelectCita = (e) => {
        const value = e.target.value;
        if (!value) {
            setForm({ ...form, codCita: '', codPaciente: '', motivo: '' });
            return;
        }
        
        const isCitaId = value.startsWith('cita-');
        
        if (isCitaId) {
            const idCita = parseInt(value.replace('cita-', ''));
            const cita = citasHoy.find(c => c.codCita === idCita);
            if (cita) {
                setForm({ ...form, codCita: cita.codCita, codPaciente: cita.codPaciente, motivo: cita.motivo || '' });
            }
        } else {
            setForm({ ...form, codCita: '', codPaciente: value, motivo: '' });
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setMensaje({ tipo: '', texto: '' });

        if (!form.codPaciente) {
            setMensaje({ tipo: 'error', texto: 'Por favor seleccione un paciente o cita de la agenda.' });
            setGuardando(false);
            return;
        }

        try {
            const token = user?.accessToken;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const payload = { ...form };
            if (!payload.codCita) delete payload.codCita;

            await axios.post('http://localhost:8080/api/medico/consultas', payload, config);

            setMensaje({ tipo: 'exito', texto: '✓ Consulta médica guardada. Receta emitida correctamente.' });
            setForm({
                codPaciente: '',
                codCita: '',
                tipoConsulta: 'CONTROL',
                motivo: '',
                examenFisico: '',
                diagnosticoCie10: '',
                diagnosticoDesc: '',
                evolucion: '',
                indicaciones: '',
                medicamentos: []
            });
            
            const resCitas = await axios.get('http://localhost:8080/api/medico/citas', config);
            const citasPendientes = (resCitas.data || []).filter(c => 
                (c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA')
            );
            setCitasHoy(citasPendientes);

        } catch (err) {
            console.error(err);
            setMensaje({ tipo: 'error', texto: '❌ Error al registrar la consulta.' });
        } finally {
            setGuardando(false);
        }
    };

    const triajeActual = form.codPaciente ? triajes[form.codPaciente] : null;

    return (
        <div>
            <div className={styles.formSection} style={{ padding: '1.5rem' }}>
                <h2 className={styles.title} style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    Atención Médica (Triaje y Consulta)
                </h2>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <label className={styles.label}>Seleccione el Paciente o Cita en Agenda *</label>
                        <select 
                            onChange={handleSelectCita}
                            value={form.codCita ? `cita-${form.codCita}` : form.codPaciente}
                            required
                            className={styles.input}
                        >
                            <option value="">-- Seleccionar --</option>
                            {citasHoy.length > 0 && (
                                <optgroup label="📋 AGENDA EN ESPERA">
                                    {citasHoy.map(c => (
                                        <option key={`cita-${c.codCita}`} value={`cita-${c.codCita}`}>
                                            ⏰ {new Date(c.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {c.pacienteNombreCompleto}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            <optgroup label="📂 HISTÓRICO GENERAL">
                                {pacientes.map(p => (
                                    <option key={p.codPaciente} value={p.codPaciente}>
                                        {p.dni} - {p.nombres} {p.apellidoPaterno}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    {triajeActual && (
                        <div className={styles.triajeAlert}>
                            <div>
                                <strong className={styles.triajeLabel}>Último Triaje</strong>
                                <span className={styles.triajeValue}>{new Date(triajeActual.fechaTriaje).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <strong className={styles.triajeLabel}>Presión</strong>
                                <span className={styles.triajeValueDanger}>{triajeActual.paSistolica}/{triajeActual.paDiastolica}</span>
                            </div>
                            <div>
                                <strong className={styles.triajeLabel}>F. Cardíaca</strong>
                                <span className={styles.triajeValue}>{triajeActual.frecCardiaca} lpm</span>
                            </div>
                            <div>
                                <strong className={styles.triajeLabel}>SatO₂</strong>
                                <span className={styles.triajeValueSuccess}>{triajeActual.saturacionO2}%</span>
                            </div>
                            <div>
                                <strong className={styles.triajeLabel}>Temp</strong>
                                <span className={styles.triajeValue}>{triajeActual.temperatura}°C</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.formSection}>
                {mensaje.texto && (
                    <div className={mensaje.tipo === 'exito' ? styles.successBox : styles.errorBox}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div className={styles.formRow}>
                        <div>
                            <label className={styles.label}>Tipo de Consulta *</label>
                            <select 
                                name="tipoConsulta"
                                value={form.tipoConsulta}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            >
                                <option value="PRIMERA_VEZ">Primera Vez</option>
                                <option value="CONTROL">Control</option>
                                <option value="URGENCIA">Urgencia</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={styles.label}>Motivo de Consulta *</label>
                        <textarea 
                            name="motivo"
                            rows="2"
                            value={form.motivo}
                            onChange={handleChange}
                            required
                            className={styles.textarea}
                        />
                    </div>

                    <div>
                        <label className={styles.label}>Examen Físico</label>
                        <textarea 
                            name="examenFisico"
                            rows="2"
                            value={form.examenFisico}
                            onChange={handleChange}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.formRowUnbalanced}>
                        <div>
                            <label className={styles.label}>CIE-10</label>
                            <input 
                                name="diagnosticoCie10"
                                type="text" 
                                placeholder="Ej: I10" 
                                value={form.diagnosticoCie10} 
                                onChange={handleChange} 
                                className={styles.input}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>Diagnóstico Definitivo *</label>
                            <input 
                                name="diagnosticoDesc"
                                type="text" 
                                placeholder="Ej: Hipertensión Esencial" 
                                value={form.diagnosticoDesc} 
                                onChange={handleChange} 
                                required 
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={styles.label}>Evolución / Observaciones</label>
                        <textarea 
                            name="evolucion"
                            rows="3"
                            value={form.evolucion}
                            onChange={handleChange}
                            className={styles.textarea}
                        />
                    </div>

                    <div>
                        <label className={styles.label}>Indicaciones Médicas / Tratamiento (Texto)</label>
                        <textarea 
                            name="indicaciones"
                            rows="3"
                            value={form.indicaciones}
                            onChange={handleChange}
                            placeholder="Escriba las indicaciones para el paciente..."
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.recipeBox}>
                        <div className={styles.recipeHeader}>
                            <h3 className={styles.title} style={{ fontSize: '1rem' }}>💊 Receta Médica Integrada</h3>
                            <button 
                                type="button" 
                                onClick={() => setForm({ ...form, medicamentos: [...(form.medicamentos || []), { medicamento: '', dosis: '', frecuencia: '', duracion: '', cantidad: 1 }] })} 
                                className={styles.btnAction}
                            >
                                + Agregar Medicamento
                            </button>
                        </div>
                        
                        {(form.medicamentos || []).length === 0 ? (
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontStyle: 'italic' }}>No se han agregado medicamentos (Opcional).</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {form.medicamentos.map((med, idx) => (
                                    <div key={idx} className={styles.recipeRow}>
                                        <div>
                                            <label className={styles.label} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Medicamento *</label>
                                            <select value={med.medicamento} onChange={(e) => {
                                                const newMeds = [...form.medicamentos];
                                                newMeds[idx].medicamento = e.target.value;
                                                setForm({ ...form, medicamentos: newMeds });
                                            }} required className={styles.input}>
                                                <option value="">-- Seleccionar Medicamento --</option>
                                                {inventario.map(inv => (
                                                    <option key={inv.id} value={inv.nombre}>{inv.nombre} ({inv.tipo})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={styles.label} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Dosis</label>
                                            <input type="text" placeholder="Ej: 500mg" value={med.dosis} onChange={(e) => {
                                                const newMeds = [...form.medicamentos];
                                                newMeds[idx].dosis = e.target.value;
                                                setForm({ ...form, medicamentos: newMeds });
                                            }} className={styles.input} />
                                        </div>
                                        <div>
                                            <label className={styles.label} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Frecuencia</label>
                                            <input type="text" placeholder="Ej: c/8h" value={med.frecuencia} onChange={(e) => {
                                                const newMeds = [...form.medicamentos];
                                                newMeds[idx].frecuencia = e.target.value;
                                                setForm({ ...form, medicamentos: newMeds });
                                            }} className={styles.input} />
                                        </div>
                                        <div>
                                            <label className={styles.label} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Duración</label>
                                            <input type="text" placeholder="Ej: 5 días" value={med.duracion} onChange={(e) => {
                                                const newMeds = [...form.medicamentos];
                                                newMeds[idx].duracion = e.target.value;
                                                setForm({ ...form, medicamentos: newMeds });
                                            }} className={styles.input} />
                                        </div>
                                        <div>
                                            <label className={styles.label} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Cant.</label>
                                            <input type="number" min="1" value={med.cantidad} onChange={(e) => {
                                                const newMeds = [...form.medicamentos];
                                                newMeds[idx].cantidad = parseInt(e.target.value) || 1;
                                                setForm({ ...form, medicamentos: newMeds });
                                            }} className={styles.input} />
                                        </div>
                                        <button type="button" onClick={() => {
                                            const newMeds = form.medicamentos.filter((_, i) => i !== idx);
                                            setForm({ ...form, medicamentos: newMeds });
                                        }} className={styles.btnDelete}>
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit" disabled={guardando} className={styles.btnPrimary} style={{ width: '100%', fontSize: '1rem' }}>
                            {guardando ? 'Guardando...' : '📁 Registrar Consulta y Emitir Receta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}