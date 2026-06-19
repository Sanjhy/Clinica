import { useState, useEffect } from 'react';
import axios from 'axios';

export function useNavbarMedico(accessToken) {
    // Estado para la fecha y hora actual en tiempo real
    const [fechaActual, setFechaActual] = useState('');
    // Estado para verificar si el servidor central MariaDB responde en la red local
    const [isLanActive, setIsLanActive] = useState(true);

    useEffect(() => {
        // 1. Formateador de fecha para simular exactamente tu diseño (Ej: 16 Jun 2026)
        const formatearFecha = () => {
            const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
            const fecha = new Date().toLocaleDateString('es-PE', opciones);
            // Quitamos el punto que a veces añade el formato abreviado (ej: "jun.")
            setFechaActual(fecha.replace('.', ''));
        };

        formatearFecha();
        const intervalReloj = setInterval(formatearFecha, 60000); // Se actualiza cada minuto

        // 2. Control de estado Offline / Online de la red LAN (Ping preventivo al backend)
        const verificarConexionLan = async () => {
            try {
                await axios.get('http://localhost:8080/api/auth/health', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setIsLanActive(true);
            } catch (error) {
                console.warn("Petición de verificación LAN fallida, activando modo contingencia local.");
                setIsLanActive(false); // Cambia el indicador a Offline si se cae el cable de red
            }
        };

        if (accessToken) {
            verificarConexionLan();
        }
        const intervalLan = setInterval(verificarConexionLan, 30000); // Mide la red cada 30 segundos

        // Limpieza de hilos de ejecución al desmontar el componente
        return () => {
            clearInterval(intervalReloj);
            clearInterval(intervalLan);
        };
    }, [accessToken]);

    return {
        fechaActual,
        isLanActive
    };
}