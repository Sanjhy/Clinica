import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDashboardMedico(accessToken) {
    // Estado de los paneles superiores (Citas hoy, en espera, urgencias, recetas)
    const [metrics, setMetrics] = useState({
        citasHoy: 8,
        enEspera: 3,
        urgencias: 1,
        recetasEmitidas: 5
    });

    // Estado para la tabla de próximos pacientes
    const [proximosPacientes, setProximosPacientes] = useState([]);
    
    // Estado para el cuadro derecho: "Paciente en curso" (Rosa García)
    const [pacienteEnCurso, setPacienteEnCurso] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si no hay token de Spring Security, no disparamos la petición
        if (!accessToken) return;

        const cargarDatosDashboard = async () => {
            try {
                // 1. Traer métricas del día en la LAN
                const resMetrics = await axios.get('http://localhost:8080/api/medico/dashboard/metrics', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setMetrics(resMetrics.data);

                // 2. Traer la lista de la cola de atención
                const resPacientes = await axios.get('http://localhost:8080/api/medico/dashboard/proximos', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setProximosPacientes(resPacientes.data);

                // 3. Traer datos del paciente en el box de atención
                const resCurso = await axios.get('http://localhost:8080/api/medico/dashboard/en-curso', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setPacienteEnCurso(resCurso.data);

            } catch (error) {
                console.error("Error al sincronizar el dashboard con MariaDB:", error);
                // Datos de respaldo basados en tus maquetas por si el backend está apagado durante el diseño
                setProximosPacientes([
                    { hora: '09:00', nombre: 'García, Rosa M.', motivo: 'Control HTA', estado: 'En curso' },
                    { hora: '09:45', nombre: 'Mendoza, Carmen R.', motivo: 'Urgencia PA', estado: 'Urgente' },
                    { hora: '10:30', nombre: 'Vargas, Pedro A.', motivo: 'Rehabilitación', estado: 'Espera' }
                ]);
                setPacienteEnCurso({
                    nombre: 'García, Rosa M.',
                    edad: 72,
                    antecedentes: 'HTA + Diabetes T2',
                    pa: '130/85',
                    fc: '78 bpm',
                    satO2: '97%'
                });
            } finally {
                setLoading(false);
            }
        };

        cargarDatosDashboard();
    }, [accessToken]);

    return {
        metrics,
        proximosPacientes,
        pacienteEnCurso,
        loading
    };
}