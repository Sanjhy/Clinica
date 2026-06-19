import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

export function useCitasEnfermera(token) {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargar = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const cfg = { headers: { Authorization: `Bearer ${token}` } };
            // Usamos pacientes para mostrar las citas asociadas
            const res = await axios.get(`${API}/api/pacientes`, cfg);
            setCitas(res.data || []);
        } catch (err) {
            console.error('Citas error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, [token]);

    return { citas, loading, recargar: cargar };
}