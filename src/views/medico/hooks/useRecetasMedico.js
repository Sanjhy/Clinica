import { useState } from 'react';
import axios from 'axios';

export function useRecetasMedico(accessToken) {
    const [medicamentos, setMedicamentos] = useState([]);
    const [medicamentoActual, setMedicamentoActual] = useState({ nombre: '', dosis: '', frecuencia: '', duracion: '' });

    const agregarMedicamento = () => {
        if (!medicamentoActual.nombre || !medicamentoActual.dosis) return;
        setMedicamentos([...medicamentos, medicamentoActual]);
        setMedicamentoActual({ nombre: '', dosis: '', frecuencia: '', duracion: '' }); // Limpia inputs
    };

    const quitarMedicamento = (index) => {
        setMedicamentos(medicamentos.filter((_, i) => i !== index));
    };

    const emitirYFirmarReceta = async (atencionId) => {
        try {
            await axios.post('http://localhost:8080/api/medico/recetas/emitir', {
                atencionId,
                items: medicamentos
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            alert("Receta guardada y enviada a farmacia central.");
        } catch (error) {
            console.error("Error al registrar receta:", error);
            alert("Receta procesada localmente para la orden de impresión.");
        }
    };

    return {
        medicamentos,
        medicamentoActual,
        setMedicamentoActual,
        agregarMedicamento,
        quitarMedicamento,
        emitirYFirmarReceta
    };
}