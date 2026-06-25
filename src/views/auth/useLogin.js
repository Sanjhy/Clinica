import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 👁️ Estado para el ojo
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            });

            const data = response.data;

            // Guardamos la sesión en el navegador
            sessionStorage.setItem('cam_user', JSON.stringify(data));

            // Redirección inteligente según el rol que viene de la base de datos
            if (data.rol === 'MEDICO') {
                navigate('/medico/dashboard');
            } else if (data.rol === 'ADMINISTRATIVO') {
                navigate('/admin/dashboard');
            } else if (data.rol === 'ENFERMERA') {
                navigate('/asistencial/dashboard');
            } else if (data.rol === 'ADMIN_TI') {
                navigate('/ti/dashboard');
            } else {
                setError('Rol no reconocido por el sistema de la clínica.');
            }

        } catch (err) {
            console.error("Error en login LAN:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Error en el inicio de sesión. Verifique su DNI y Contraseña.');
            } else if (err.message === 'Network Error') {
                setError('Error de conexión (CORS o Servidor apagado). Asegúrese de usar http://localhost:5173 y que el backend esté encendido.');
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('No se pudo conectar con el servidor central. Verifique la red LAN.');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        error,
        loading,
        handleLogin
    };
}