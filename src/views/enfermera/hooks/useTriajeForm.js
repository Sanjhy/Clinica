import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

export function useTriajeForm(token) {
    const [form, setForm] = useState({
        paSistolica: '',
        paDiastolica: '',
        frecCardiaca: '',
        temperatura: '',
        saturacionO2: '',
        pesoKg: '',
        tallaCm: '',
        prioridad: 'NORMAL'
    });
    const [guardando, setGuardando] = useState(false);

    const enviarTriaje = async (pacienteId) => {
        setGuardando(true);
        try {
            const cfg = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API}/api/clinica/triajes`, {
                paSistolica:   parseInt(form.paSistolica),
                paDiastolica:  parseInt(form.paDiastolica),
                frecCardiaca:  parseInt(form.frecCardiaca),
                temperatura:   parseFloat(form.temperatura),
                saturacionO2:  parseInt(form.saturacionO2),
                pesoKg:        parseFloat(form.pesoKg),
                tallaCm:       parseInt(form.tallaCm),
                prioridad:     form.prioridad,
                paciente:      { codPaciente: pacienteId }
            }, cfg);
            return true;
        } catch (err) {
            console.error('Triaje error:', err);
            return false;
        } finally {
            setGuardando(false);
        }
    };

    return { form, setForm, guardando, enviarTriaje };
}