import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

export function useDashboardEnfermera(token) {
    const [datos, setDatos] = useState({ realizados: 0, pendientes: 0, urgentes: 0 });
    const [citasHoy, setCitasHoy] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetch = async () => {
            try {
                const cfg = { headers: { Authorization: `Bearer ${token}` } };
                // Usamos el endpoint real: GET /api/pacientes devuelve todos los pacientes
                // Y triajes recientes se pueden derivar del dashboard
                const resPac = await axios.get(`${API}/api/pacientes`, cfg);
                const pacs = resPac.data || [];

                // Intentar cargar citas del día
                setDatos({
                    realizados: 0,
                    pendientes: pacs.length,
                    urgentes: 0
                });
                setCitasHoy([]);
            } catch (err) {
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [token]);

    return { datos, citasHoy, loading };
}