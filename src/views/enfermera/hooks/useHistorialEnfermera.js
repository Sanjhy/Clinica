import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

export function useHistorialEnfermera(pacienteId, token) {
    const [expediente, setExpediente] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || !pacienteId) return;
        const fetch = async () => {
            setLoading(true);
            try {
                const cfg = { headers: { Authorization: `Bearer ${token}` } };
                const [resExp, resHist] = await Promise.all([
                    axios.get(`${API}/api/pacientes/${pacienteId}/expediente`, cfg),
                    axios.get(`${API}/api/clinica/historial/paciente/${pacienteId}`, cfg)
                ]);
                setExpediente(resExp.data);
                setHistorial(resHist.data || []);
            } catch (err) {
                console.error('Historial error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [pacienteId, token]);

    return { expediente, historial, loading };
}