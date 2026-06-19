import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/auth/Login';
import LayoutMedico from './views/medico/pages/LayoutMedico';
import LayoutEnfermera from './views/enfermera/pages/LayoutEnfermera';

/**
 * 🔒 GUARDÍAN DE RUTAS (ProtectedRoute)
 * Verifica en el almacenamiento local de la LAN si el usuario está autenticado
 * y si cuenta con el rol requerido para ver la pantalla.
 */
function ProtectedRoute({ children, allowedRoles }) {
    const sessionData = localStorage.getItem('cam_user');
    
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
        <BrowserRouter>
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

                {/* 🔄 Rutas temporales para los otros módulos que armaremos luego */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN_TI']}>
                            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                                <h2>🛠️ Módulo de Administración de TI</h2>
                                <p>Infraestructura LAN de MariaDB detectada. Próximamente en desarrollo...</p>
                                <button onClick={() => { localStorage.clear(); window.location.href='/'; }}>Cerrar sesión</button>
                            </div>
                        </ProtectedRoute>
                    } 
                />

                {/* Captura de errores 404 - Cualquier ruta rota te regresa al login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;