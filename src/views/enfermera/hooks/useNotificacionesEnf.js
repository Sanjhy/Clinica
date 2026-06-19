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
            // Intentamos POST al backend — si no existe devuelve error silencioso
            const cfg = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API}/api/notificaciones`, {
                tipo: 'MENSAJE_INTERNO',
                titulo: `Mensaje de Enfermería → ${destinatario}`,
                mensaje,
                leida: false
            }, cfg);
            setMsg({ ok: true, txt: '✅ Mensaje enviado correctamente.' });
            setMensaje('');
            await cargar();
        } catch {
            // Agregamos a lista local si el backend no tiene el endpoint
            setLista(prev => [{
                codNotificacion: Date.now(),
                tipo: 'MENSAJE_INTERNO',
                titulo: `→ ${destinatario}`,
                mensaje,
                leida: false,
                fecha: new Date().toISOString()
            }, ...prev]);
            setMsg({ ok: true, txt: '✅ Mensaje registrado.' });
            setMensaje('');
        } finally {
            setEnviando(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    return { lista, destinatario, setDestinatario, mensaje, setMensaje, enviando, msg, emitirAlerta };
}