import React, { useState } from 'react';
import axios from 'axios';

export default function RecetasMedico({ atencionId = 1 }) {
    const [medicamentos, setMedicamentos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [indicacion, setIndicacion] = useState('');

    const agregarFarmaco = (e) => {
        e.preventDefault();
        if (!nombre || !indicacion) return;
        setMedicamentos([...medicamentos, { nombre, indicacion }]);
        setNombre('');
        setIndicacion('');
    };

    const enviarReceta = async () => {
        if (medicamentos.length === 0) return;
        try {
            const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
            const config = { headers: { Authorization: `Bearer ${session.accessToken}` } };

            await axios.post('http://localhost:8080/api/medico/recetas/guardar', {
                atencionId: atencionId,
                items: medicamentos
            }, config);

            alert("✓ Receta enviada al servidor de farmacia e impresión local.");
            setMedicamentos([]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e5e0' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#033323' }}>Prescripción de Medicamentos</h2>
            
            <form onSubmit={agregarFarmaco} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Nombre del medicamento" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ padding: '0.6rem', border: '1px solid #dcdbd6', borderRadius: '6px', flex: 2 }} required />
                <input type="text" placeholder="Indicaciones (Ej: 1 tab cada 8h)" value={indicacion} onChange={(e) => setIndicacion(e.target.value)} style={{ padding: '0.6rem', border: '1px solid #dcdbd6', borderRadius: '6px', flex: 2 }} required />
                <button type="submit" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#033323', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ Añadir</button>
            </form>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#555555', textTransform: 'uppercase' }}>Fármacos en la receta</h3>
                {medicamentos.length === 0 ? <p style={{ fontStyle: 'italic', color: '#888888', fontSize: '0.9rem' }}>No hay medicamentos agregados.</p> : (
                    medicamentos.map((m, i) => (
                        <div key={i} style={{ padding: '0.75rem', background: '#fcfbf7', border: '1px solid #e5e5e0', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>💊 <strong>{m.nombre}</strong> — {m.indicacion}</span>
                        </div>
                    ))
                )}
            </div>

            <button onClick={enviarReceta} disabled={medicamentos.length === 0} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: medicamentos.length === 0 ? 'not-allowed' : 'pointer' }}>
                🖨️ Procesar y Firmar Receta
            </button>
        </div>
    );
}