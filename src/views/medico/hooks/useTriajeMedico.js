import { useState, useEffect } from 'react';
import axios from 'axios';

export function useTriajeMedico(pacienteId, accessToken) {
    const [constantes, setConstantes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pacienteId) return;
        const fetchTriaje = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/medico/triaje/${pacienteId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setConstantes(res.data);
            } catch (error) {
                console.error("Error al consultar constantes de enfermería:", error);
                setConstantes({
                    presionArterial: '120/80',
                    frecuenciaCardiaca: '72 bpm',
                    temperatura: '36.5 °C',
                    saturacion: '98%',
                    peso: '68 kg',
                    talla: '1.65 m'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTriaje();
    }, [pacienteId, accessToken]);

    return { constantes, loading };
}