import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePacientesMedico(accessToken) {
    const [todosPacientes, setTodosPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) return;
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:8080/api/pacientes', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setTodosPacientes(res.data || []);
            } catch (err) {
                console.error('Error al cargar pacientes:', err);
                setTodosPacientes([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [accessToken]);

    // Filtrar en el frontend para no hacer peticiones en cada tecla
    const pacientes = todosPacientes.filter(p => {
        if (!busqueda) return true;
        const q = busqueda.toLowerCase();
        const nombre = (p.nombreCompleto || `${p.nombres || ''} ${p.apellidoPaterno || ''}`).toLowerCase();
        return nombre.includes(q) || (p.dni || '').includes(q);
    });

    return { pacientes, busqueda, setBusqueda, loading };
}