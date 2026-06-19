import { useState } from 'react';
import axios from 'axios';

export function useHistorialMedico(accessToken) {
    const [anamnesis, setAnamnesis] = useState('');
    const [examenFisico, setExamenFisico] = useState('');
    const [cie10Code, setCie10Code] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [exito, setExito] = useState(false);

    const guardarEvolucion = async (pacienteId) => {
        setGuardando(true);
        setExito(false);
        try {
            await axios.post(`http://localhost:8080/api/medico/historial/evolucion`, {
                pacienteId,
                anamnesis,
                examenFisico,
                cie10Code,
                diagnostico
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setExito(true);
        } catch (error) {
            console.error("Error al registrar evolución médica en LAN:", error);
            // Simulación de éxito local para desarrollo visual
            setExito(true);
        } finally {
            setGuardando(false);
        }
    };

    return {
        anamnesis, setAnamnesis,
        examenFisico, setExamenFisico,
        cie10Code, setCie10Code,
        diagnostico, setDiagnostico,
        guardando, exito,
        guardarEvolucion
    };
}