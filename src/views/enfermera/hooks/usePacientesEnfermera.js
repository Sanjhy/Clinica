import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePacientesEnfermera(token) {
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchPacientes = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:8080/api/pacientes`, config);
                setPacientes(res.data || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchPacientes();
    }, [busqueda, token]);

    return { pacientes, busqueda, setBusqueda, loading };
}