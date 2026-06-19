import { useState, useEffect } from 'react';
import axios from 'axios';

export function useNavbarEnfermera(accessToken) {
    const [fechaActual, setFechaActual] = useState('');
    const [isLanActive, setIsLanActive] = useState(true);

    useEffect(() => {
        const formatearFecha = () => {
            const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
            setFechaActual(new Date().toLocaleDateString('es-PE', opciones).replace('.', ''));
        };
        formatearFecha();
        const intervalReloj = setInterval(formatearFecha, 60000);

        const verificarLan = async () => {
            try {
                await axios.get('http://localhost:8080/api/auth/health', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setIsLanActive(true);
            } catch {
                setIsLanActive(false);
            }
        };
        if (accessToken) verificarLan();
        const intervalLan = setInterval(verificarLan, 30000);

        return () => { clearInterval(intervalReloj); clearInterval(intervalLan); };
    }, [accessToken]);

    return { fechaActual, isLanActive };
}