import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

const calcEdad = (fn) => {
    if (!fn) return '?';
    const hoy = new Date(), nac = new Date(fn);
    let e = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) e--;
    return e;
};

export default function PacienteEnfermera({ user, onVerDatos, onHacerTriaje }) {
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'nuevo' | 'editar'
    const [seleccionado, setSeleccionado] = useState(null);
    const [form, setForm] = useState(formVacio());
    const [guardando, setGuardando] = useState(false);
    const [msg, setMsg] = useState(null);

    const cfg = { headers: { Authorization: `Bearer ${user?.accessToken}` } };

    const cargar = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/pacientes`, cfg);
            setPacientes(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (user?.accessToken) cargar(); }, [user]);

    const filtrados = pacientes.filter(p => {
        const q = busqueda.toLowerCase();
        return (
            p.dni?.includes(q) ||
            p.nombres?.toLowerCase().includes(q) ||
            p.apellidoPaterno?.toLowerCase().includes(q) ||
            p.apellidoMaterno?.toLowerCase().includes(q)
        );
    });

    const abrirNuevo = () => { setForm(formVacio()); setModal('nuevo'); };
    const abrirEditar = (p) => {
        setSeleccionado(p);
        const formatFecha = (f) => f ? f.split('T')[0] : '';
        setForm({
            dni: p.dni || '', 
            nombres: p.nombres || '',
            apellidoPaterno: p.apellidoPaterno || '', 
            apellidoMaterno: p.apellidoMaterno || '',
            fechaNacimiento: formatFecha(p.fechaNacimiento), 
            sexo: p.sexo || 'F',
            telefono: p.telefono || '', 
            codTipoSeguro: p.codTipoSeguro || 1,
        });
        setModal('editar');
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        try {
            if (modal === 'nuevo') {
                await axios.post(`${API}/api/pacientes`, form, cfg);
                setMsg({ ok: true, txt: '✅ Paciente registrado correctamente.' });
            } else {
                await axios.put(`${API}/api/pacientes/${seleccionado.codPaciente}`, form, cfg);
                setMsg({ ok: true, txt: '✅ Datos actualizados.' });
            }
            await cargar();
            setModal(null);
        } catch (err) {
            setMsg({ ok: false, txt: err.response?.data?.message || '⚠️ Error al guardar. Verifica los datos.' });
        } finally {
            setGuardando(false);
            setTimeout(() => setMsg(null), 3500);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: '#033323', fontWeight: 700 }}>Pacientes</h1>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>Buscar, registrar y editar pacientes</p>
                </div>
                <button onClick={abrirNuevo} style={btnPrimary}>
                    + Nuevo Paciente
                </button>
            </div>

            {msg && <Alert ok={msg.ok} txt={msg.txt} />}

            {/* Barra búsqueda */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                <input
                    type="text"
                    placeholder="🔍 Buscar por DNI, nombre o apellido..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={inputSt}
                />
            </div>

            {/* Tabla */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {['Paciente', 'DNI', 'Edad/Sexo', 'Teléfono', 'Seguro', 'Acciones'].map(h => (
                                    <th key={h} style={thSt}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>Cargando...</td></tr>
                            ) : filtrados.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                    {busqueda ? 'No se encontraron resultados.' : 'No hay pacientes registrados.'}
                                </td></tr>
                            ) : filtrados.map(p => (
                                <tr key={p.codPaciente} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ ...tdSt, fontWeight: 600 }}>
                                        {p.apellidoPaterno} {p.apellidoMaterno}, {p.nombres}
                                    </td>
                                    <td style={{ ...tdSt, fontFamily: 'monospace' }}>{p.dni}</td>
                                    <td style={tdSt}>{calcEdad(p.fechaNacimiento)} · {p.sexo === 'F' ? '♀' : '♂'}</td>
                                    <td style={{ ...tdSt, color: '#6b7280' }}>{p.telefono || '—'}</td>
                                    <td style={tdSt}>
                                        <span style={seguroBadge(p.codTipoSeguro)}>
                                            {p.tipoSeguro || (p.codTipoSeguro === 1 ? 'SIS' : p.codTipoSeguro === 2 ? 'ESSALUD' : 'PART.')}
                                        </span>
                                    </td>
                                    <td style={{ ...tdSt, display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <button onClick={() => onVerDatos(p.codPaciente)} style={btnSec}>
                                            Historial
                                        </button>
                                        <button onClick={() => abrirEditar(p)} style={btnSec}>
                                            Editar
                                        </button>
                                        <button onClick={() => onHacerTriaje(p.codPaciente, null)} style={btnGreen}>
                                            Triaje
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Nuevo / Editar */}
            {modal && (
                <div style={overlay} onClick={() => setModal(null)}>
                    <div style={modalBox} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#033323' }}>
                                {modal === 'nuevo' ? '➕ Registrar nuevo paciente' : '✏️ Editar datos del paciente'}
                            </h2>
                            <button onClick={() => setModal(null)} style={btnClose}>✕</button>
                        </div>
                        <form onSubmit={handleGuardar}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                                <FormField label="DNI" name="dni" value={form.dni} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} placeholder="8 dígitos" required maxLength={8} disabled={modal === 'editar'} />
                                <FormField label="Nombre(s)" name="nombres" value={form.nombres} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} placeholder="Nombres" required />
                                <FormField label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} placeholder="Apellido paterno" required />
                                <FormField label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} placeholder="Apellido materno" />
                                <FormField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} required />
                                <div>
                                    <label style={lblSt}>Sexo</label>
                                    <select name="sexo" value={form.sexo} onChange={e => setForm(f => ({ ...f, sexo: e.target.value }))} style={inputSt}>
                                        <option value="F">Femenino</option>
                                        <option value="M">Masculino</option>
                                    </select>
                                </div>
                                <FormField label="Teléfono" name="telefono" value={form.telefono} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} placeholder="Ej: 987654321" />
                                <div>
                                    <label style={lblSt}>Tipo de Seguro</label>
                                    <select name="codTipoSeguro" value={form.codTipoSeguro} onChange={e => setForm(f => ({ ...f, codTipoSeguro: parseInt(e.target.value) }))} style={inputSt}>
                                        <option value={1}>SIS</option>
                                        <option value={2}>ESSALUD</option>
                                        <option value={3}>PARTICULAR</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setModal(null)} style={btnSec}>Cancelar</button>
                                <button type="submit" disabled={guardando} style={btnPrimary}>
                                    {guardando ? '⏳ Guardando...' : '💾 Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function FormField({ label, name, type = 'text', value, onChange, placeholder, required, maxLength, disabled }) {
    return (
        <div>
            <label style={lblSt}>{label}</label>
            <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
                required={required} maxLength={maxLength} disabled={disabled}
                style={{ ...inputSt, background: disabled ? '#f3f4f6' : '#fff', color: disabled ? '#6b7280' : '#111827', cursor: disabled ? 'not-allowed' : 'text' }} />
        </div>
    );
}

function Alert({ ok, txt }) {
    return (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem', background: ok ? '#f0fdf4' : '#fef2f2', color: ok ? '#065f46' : '#b91c1c', border: `1px solid ${ok ? '#bbf7d0' : '#fecaca'}` }}>
            {txt}
        </div>
    );
}

function formVacio() {
    return { dni: '', nombres: '', apellidoPaterno: '', apellidoMaterno: '', fechaNacimiento: '', sexo: 'F', telefono: '', codTipoSeguro: 1 };
}

function seguroBadge(tipo) {
    const map = { 1: ['#eff6ff', '#1d4ed8'], 2: ['#f0fdf4', '#065f46'], 3: ['#faf5ff', '#6b21a8'] };
    const [bg, color] = map[tipo] || map[3];
    return { background: bg, color, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '20px' };
}

const inputSt = { width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.88rem', boxSizing: 'border-box', outline: 'none' };
const lblSt = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' };
const thSt = { textAlign: 'left', padding: '0.65rem 0.85rem', color: '#6b7280', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const tdSt = { padding: '0.75rem 0.85rem', color: '#111827' };
const btnPrimary = { background: '#033323', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' };
const btnSec = { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' };
const btnGreen = { background: '#0d9488', color: '#fff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' };
const btnClose = { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#9ca3af', padding: '0.25rem' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' };
const modalBox = { background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };