import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDatosPacienteMedico(pacienteId, accessToken) {
    const [pacienteInfo, setPacienteInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pacienteId) return;
        const fetchDetalle = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/pacientes/${pacienteId}/expediente`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setPacienteInfo(res.data);
            } catch (error) {
                console.error("Error al cargar expediente del paciente:", error);
                setPacienteInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetalle();
    }, [pacienteId, accessToken]);

    return { pacienteInfo, loading };
}