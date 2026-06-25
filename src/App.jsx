import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './views/auth/Login';
import LayoutMedico from './views/medico/pages/LayoutMedico';
import LayoutEnfermera from './views/enfermera/pages/LayoutEnfermera';
import LayoutAdmin from './views/admin/pages/LayoutAdmin';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

/**
 * 🛡️ COMPONENTE DE INACTIVIDAD (Auto Logout)
 */
function IdleTimer() {
    const navigate = useNavigate();

    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            // 15 minutos = 900000 ms
            timeoutId = setTimeout(() => {
                const sessionData = sessionStorage.getItem('cam_user');
                if (sessionData) {
                    sessionStorage.clear();
                    alert("Sesión cerrada automáticamente por inactividad.");
                    navigate('/login', { replace: true });
                }
            }, 900000);
        };

        const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

        events.forEach(event => window.addEventListener(event, resetTimer));

        // Iniciar el temporizador por primera vez
        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [navigate]);

    return null;
}

/**
 * 🔒 GUARDÍAN DE RUTAS (ProtectedRoute)
 * Verifica en el almacenamiento local de la LAN si el usuario está autenticado
 * y si cuenta con el rol requerido para ver la pantalla.
 */
function ProtectedRoute({ children, allowedRoles }) {
    const sessionData = sessionStorage.getItem('cam_user');
    
    // 1. Si no hay sesión iniciada, patitas a la calle (al Login)
    if (!sessionData) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(sessionData);

    // 2. Si el rol de la base de datos no está en la lista de permitidos, rebota al login
    if (!allowedRoles.includes(user.rol)) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si todo está correcto, renderiza la pantalla solicitada
    return children;
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <IdleTimer />
                <Routes>
                    {/* Redirección inicial automática al Login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    
                    {/* Portal de Acceso Único para todos los Roles */}
                    <Route path="/login" element={<Login />} />

                    {/* 🩺 ECOSISTEMA EXCLUSIVO DEL MÉDICO (Ruta Protegida) */}
                    <Route 
                        path="/medico/dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['MEDICO']}>
                                <LayoutMedico />
                            </ProtectedRoute>
                        } 
                    />

                    {/* 🖥️ ECOSISTEMA EXCLUSIVO DE ENFERMERÍA (Ruta Protegida) */}
                    <Route 
                        path="/asistencial/dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['ENFERMERA']}>
                                <LayoutEnfermera />
                            </ProtectedRoute>
                        } 
                    />

                    {/* 🏢 ECOSISTEMA EXCLUSIVO DEL ADMINISTRADOR (Ruta Protegida) */}
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['ADMINISTRATIVO']}>
                                <LayoutAdmin />
                            </ProtectedRoute>
                        } 
                    />

                    {/* 🔄 Rutas temporales para los otros módulos que armaremos luego */}
                    <Route 
                        path="/ti/dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN_TI']}>
                                <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                                    <h2>🛠️ Módulo de Administración de TI</h2>
                                    <p>Infraestructura LAN de MariaDB detectada. Próximamente en desarrollo...</p>
                                    <button onClick={() => { sessionStorage.clear(); window.location.href='/'; }}>Cerrar sesión</button>
                                </div>
                            </ProtectedRoute>
                        } 
                    />

                    {/* Captura de errores 404 - Cualquier ruta rota te regresa al login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;