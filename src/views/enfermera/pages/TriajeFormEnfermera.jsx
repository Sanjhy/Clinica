import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTriajeForm } from '../hooks/useTriajeForm';

const API = 'http://localhost:8080';

const PRIORIDADES = [
    { value: 'NORMAL',  label: 'Normal',  color: '#065f46', bg: '#d1fae5' },
    { value: 'URGENTE', label: 'Urgente', color: '#92400e', bg: '#fef3c7' },
    { value: 'CRITICO', label: 'Crítico', color: '#7f1d1d', bg: '#fee2e2' },
];

export default function TriajeFormEnfermera({ user, pacienteId, alTerminar }) {
    const { form, setForm, guardando, enviarTriaje } = useTriajeForm(user?.accessToken);

    const [paciente, setPaciente]       = useState(null);
    const [medicos, setMedicos]         = useState([]);
    const [medicoSel, setMedicoSel]     = useState('');
    const [filtroEsp, setFiltroEsp]     = useState('Todas');
    const [msg, setMsg]                 = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const cfg = { headers: { Authorization: `Bearer ${user?.accessToken}` } };

    /* ─── Cargar paciente + lista de médicos activos ─── */
    useEffect(() => {
        if (!user?.accessToken) return;

        const promises = [
            axios.get(`${API}/api/usuarios/medicos`, cfg).catch(() => ({ data: [] })),
        ];

        if (pacienteId) {
            promises.push(
                axios.get(`${API}/api/pacientes/${pacienteId}/expediente`, cfg)
                     .catch(() => ({ data: null }))
            );
        }

        Promise.all(promises).then(([resMed, resExp]) => {
            setMedicos(resMed.data || []);
            if (resExp) {
                const p = resExp.data?.paciente || resExp.data;
                setPaciente(p || null);
            }
        }).finally(() => setLoadingData(false));
    }, [pacienteId, user]);

    /* ─── Envío del formulario ─── */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!medicoSel) {
            setMsg({ ok: false, txt: '⚠️ Debes seleccionar un médico antes de continuar.' });
            return;
        }

        // 1) Registrar triaje
        const exito = await enviarTriaje(pacienteId);
        if (!exito) {
            setMsg({ ok: false, txt: '⚠️ Error al registrar el triaje. Revisa los datos.' });
            return;
        }

        // 2) Asignar médico al paciente
        try {
            await axios.patch(
                `${API}/api/pacientes/${pacienteId}/medico`,
                { codMedico: parseInt(medicoSel) },
                cfg
            );
        } catch {
            setMsg({ ok: false, txt: '✅ Triaje guardado, pero no se pudo asignar el médico.' });
            setTimeout(() => alTerminar(), 2000);
            return;
        }

        const medicoObj = medicos.find(m => String(m.codUsuario) === String(medicoSel));
        setMsg({
            ok: true,
            txt: `✅ Triaje registrado y paciente asignado al Dr. ${medicoObj?.nombreCompleto || ''}.`
        });
        setTimeout(() => alTerminar(), 1800);
    };

    // ── Campo de entrada Helper (Inline JSX para evitar perdida de foco) ──
    const renderCampo = (label, name, placeholder, unit) => (
        <div key={name}>
            <label style={lblSt}>
                {label}
                {unit && <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.77rem' }}> ({unit})</span>}
            </label>
            <input
                type="text"
                inputMode="decimal"
                value={form[name] || ''}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                placeholder={placeholder}
                required
                style={inputSt}
            />
        </div>
    );

    if (loadingData) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6b7280' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <p>Cargando datos...</p>
            </div>
        </div>
    );

    const especialidades = ['Todas', ...new Set(medicos.map(m => m.especialidad || 'General'))];
    const medicosFiltrados = medicos.filter(m => filtroEsp === 'Todas' || (m.especialidad || 'General') === filtroEsp);

    return (
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Título */}
            <div>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: '#033323', fontWeight: 700 }}>
                    🩺 Registro de Triaje
                </h1>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                    Registra los signos vitales y asigna el médico tratante.
                </p>
            </div>

            {/* Banner paciente */}
            {paciente && (
                <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={avatarSt}>
                        {(paciente.nombreCompleto?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '1rem' }}>
                            {paciente.nombreCompleto}
                        </p>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                            DNI: {paciente.dni}
                            {paciente.fechaNacimiento && ` · ${calcEdad(paciente.fechaNacimiento)} años`}
                            {paciente.sexo && ` · ${paciente.sexo === 'F' ? 'Femenino' : 'Masculino'}`}
                        </p>
                    </div>
                </div>
            )}

            {msg && (
                <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.88rem', background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#065f46' : '#b91c1c', border: `1px solid ${msg.ok ? '#bbf7d0' : '#fecaca'}` }}>
                    {msg.txt}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* ── Presión Arterial ── */}
                <div style={card}>
                    <h3 style={secTitle}>❤️ Presión Arterial</h3>
                    <div style={grid2}>
                        {renderCampo("Sistólica", "paSistolica", "Ej: 120", "mmHg")}
                        {renderCampo("Diastólica", "paDiastolica", "Ej: 80", "mmHg")}
                    </div>
                </div>

                {/* ── Constantes vitales ── */}
                <div style={card}>
                    <h3 style={secTitle}>📊 Constantes Vitales</h3>
                    <div style={grid3}>
                        {renderCampo("Frec. Cardíaca", "frecCardiaca", "Ej: 72", "bpm")}
                        {renderCampo("Temperatura", "temperatura", "Ej: 36.5", "°C")}
                        {renderCampo("Saturación O₂", "saturacionO2", "Ej: 98", "%")}
                    </div>
                </div>

                {/* ── Antropometría ── */}
                <div style={card}>
                    <h3 style={secTitle}>⚖️ Antropometría</h3>
                    <div style={grid2}>
                        {renderCampo("Peso", "pesoKg", "Ej: 70.5", "kg")}
                        {renderCampo("Talla", "tallaCm", "Ej: 165", "cm")}
                    </div>
                </div>

                {/* ── Prioridad ── */}
                <div style={card}>
                    <h3 style={secTitle}>🚦 Nivel de Prioridad</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {PRIORIDADES.map(p => (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setForm(f => ({ ...f, prioridad: p.value }))}
                                style={{
                                    padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700,
                                    cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s',
                                    border: form.prioridad === p.value ? `2px solid ${p.color}` : '2px solid #e5e7eb',
                                    background: form.prioridad === p.value ? p.bg : '#f9fafb',
                                    color: form.prioridad === p.value ? p.color : '#6b7280',
                                }}
                            >
                                {form.prioridad === p.value ? '✓ ' : ''}{p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Asignación de Médico ── */}
                <div style={{ ...card, border: medicoSel ? '1px solid #bbf7d0' : '1px solid #e5e7eb' }}>
                    <h3 style={secTitle}>👨‍⚕️ Asignar Médico Tratante</h3>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.83rem', color: '#6b7280' }}>
                        Selecciona el médico que atenderá al paciente. Solo aparecen los médicos <strong>activos</strong> en el sistema.
                    </p>

                    {medicos.length === 0 ? (
                        <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', border: '1px solid #fecaca' }}>
                            ⚠️ No hay médicos activos disponibles. Contacta al administrador.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginRight: '0.5rem' }}>Filtrar por Especialidad:</label>
                                <select 
                                    value={filtroEsp} 
                                    onChange={(e) => { setFiltroEsp(e.target.value); setMedicoSel(''); }}
                                    style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                                >
                                    {especialidades.map(esp => (
                                        <option key={esp} value={esp}>{esp}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {medicosFiltrados.length === 0 && (
                                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', color: '#6b7280', fontSize: '0.85rem', textAlign: 'center' }}>
                                    No hay médicos disponibles para la especialidad seleccionada.
                                </div>
                            )}

                            {medicosFiltrados.map(m => (
                                <label
                                    key={m.codUsuario}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '0.9rem 1.1rem', borderRadius: '10px', cursor: 'pointer',
                                        border: String(medicoSel) === String(m.codUsuario)
                                            ? '2px solid #033323' : '2px solid #e5e7eb',
                                        background: String(medicoSel) === String(m.codUsuario)
                                            ? '#f0fdf4' : '#fff',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="medico"
                                        value={m.codUsuario}
                                        checked={String(medicoSel) === String(m.codUsuario)}
                                        onChange={() => setMedicoSel(m.codUsuario)}
                                        style={{ accentColor: '#033323', width: 18, height: 18, flexShrink: 0 }}
                                    />
                                    {/* Avatar inicial */}
                                    <div style={{
                                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                                        background: 'linear-gradient(135deg,#033323,#0d9488)',
                                        color: '#fff', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem'
                                    }}>
                                        {(m.nombre?.[0] || 'D').toUpperCase()}
                                    </div>
                                    {/* Nombre completo */}
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                                            Dr. {m.nombre} {m.apellidos}
                                        </p>
                                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: '#6b7280' }}>
                                            <strong>{m.especialidad || 'Medicina General'}</strong>
                                            {m.colegiatura ? ` · CMP: ${m.colegiatura}` : ''}
                                        </p>
                                    </div>
                                    {/* Badge seleccionado */}
                                    {String(medicoSel) === String(m.codUsuario) && (
                                        <span style={{ marginLeft: 'auto', background: '#033323', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                                            Asignado
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Botones ── */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingBottom: '1rem' }}>
                    <button type="button" onClick={alTerminar} style={btnSec}>Cancelar</button>
                    <button
                        type="submit"
                        disabled={guardando || !medicoSel}
                        style={{
                            background: (guardando || !medicoSel) ? '#9ca3af' : '#033323',
                            color: '#fff', border: 'none', padding: '0.75rem 2rem',
                            borderRadius: '8px', cursor: (guardando || !medicoSel) ? 'not-allowed' : 'pointer',
                            fontWeight: 700, fontSize: '0.95rem', transition: 'background 0.2s'
                        }}
                    >
                        {guardando ? '⏳ Registrando...' : '✅ Confirmar Triaje y Asignar Médico'}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ── Helpers ── */
function calcEdad(fn) {
    if (!fn) return '?';
    const hoy = new Date(), nac = new Date(fn);
    let e = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) e--;
    return e;
}

/* ── Estilos ── */
const card    = { background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' };
const secTitle = { margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: '#033323' };
const lblSt   = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' };
const inputSt = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#111827' };
const grid2   = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' };
const grid3   = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem' };
const avatarSt = { width: 48, height: 48, borderRadius: '50%', background: '#033323', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 };
const btnSec  = { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' };