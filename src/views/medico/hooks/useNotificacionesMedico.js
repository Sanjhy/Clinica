import { useState, useEffect } from 'react';
import axios from 'axios';

export function useNotificacionesMedico(accessToken) {
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        const cargarNotificaciones = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/medico/notificaciones', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setNotificaciones(res.data);
            } catch (error) {
                console.error("Error al capturar alertas LAN:", error);
                setNotificaciones([
                    { id: 1, mensaje: 'Triaje crítico registrado para paciente Mendoza C.', severidad: 'ALTA', hora: 'Hace 5 min' },
                    { id: 2, mensaje: 'Cambio de horario en cita de las 11:00 AM', severidad: 'MEDIA', hora: 'Hace 20 min' }
                ]);
            }
        };

        cargarNotificaciones();
    }, [accessToken]);

    return { notificaciones };
}