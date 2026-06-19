import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCitasMedico(accessToken) {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/medico/citas/agenda', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setCitas(res.data);
            } catch (error) {
                console.error("Error al recuperar la agenda de citas:", error);
                setCitas([
                    { id: 101, hora: '08:00 AM', paciente: 'Ruiz Alberto', tipo: 'Primera vez' },
                    { id: 102, hora: '08:30 AM', paciente: 'Palomino Inés', tipo: 'Reevaluación' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCitas();
    }, [accessToken]);

    return { citas, loading };
}