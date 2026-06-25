import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

export function useNotificacionesEnf(token) {
    const [lista, setLista] = useState([]);
    const [destinatario, setDestinatario] = useState('MEDICO');
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [msg, setMsg] = useState(null);

    const cargar = async () => {
        if (!token) return;
        try {
            const cfg = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API}/api/notificaciones`, cfg);
            setLista(res.data || []);
        } catch {
            // si no existe el endpoint, usamos lista vacía
            setLista([]);
        }
    };

    useEffect(() => { cargar(); }, [token]);

    const emitirAlerta = async (e) => {
        e.preventDefault();
        if (!mensaje.trim()) return;
        setEnviando(true);
        try {
            const cfg = { headers: { Authorization: `Bearer ${token}` } };
            
            // Determinar el rol destino según la selección
            let rolBackend = destinatario;
            if (destinatario === 'ADMIN') rolBackend = 'ADMINISTRATIVO';
            if (destinatario === 'ADMIN_TI') rolBackend = 'ADMIN_TI'; // O el rol exacto en DB

            await axios.post(`${API}/api/notificaciones/rol/${rolBackend}`, {
                titulo: `Alerta de Enfermería`,
                mensaje,
                referenciaTipo: 'MENSAJE_INTERNO'
            }, cfg);
            
            setMsg({ ok: true, txt: '✅ Mensaje enviado correctamente al equipo de ' + destinatario + '.' });
            setMensaje('');
        } catch (err) {
            console.error(err);
            setMsg({ ok: false, txt: '❌ Error al enviar el mensaje al servidor.' });
        } finally {
            setEnviando(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    return { lista, destinatario, setDestinatario, mensaje, setMensaje, enviando, msg, emitirAlerta };
}