import React, { useState, useEffect } from 'react';
import NavbarMedico from '../components/NavbarMedico';
import SidebarMedico from '../components/SidebarMedico';
import DashboardMedico from './DashboardMedico';
import PacienteMedico from './PacienteMedico';
import HistorialClinicoMedico from './HistorialClinicoMedico';
import TriajeMedico from './TriajeMedico';
import CitasMedico from './CitasMedico';
import RecetasMedico from './RecetasMedico';
import NotificacionesMedico from './NotificacionesMedico';
import PerfilMedico from './PerfilMedico';

export default function LayoutMedico() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('dashboard');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
        setUser(session);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const handleLogout = () => {
        localStorage.removeItem('cam_user');
        window.location.href = '/';
    };

    const handleNavegar = (vista) => {
        setVistaActiva(vista);
        if (isSidebarOpen) setIsSidebarOpen(false);
    };

    const renderVista = () => {
        switch (vistaActiva) {
            case 'dashboard':      return <DashboardMedico user={user} onNavegar={handleNavegar} />;
            case 'pacientes':      return <PacienteMedico user={user} />;
            case 'historial':      return <HistorialClinicoMedico user={user} />;
            case 'triaje':         return <TriajeMedico user={user} />;
            case 'citas':          return <CitasMedico user={user} />;
            case 'recetas':        return <RecetasMedico user={user} />;
            case 'notificaciones': return <NotificacionesMedico user={user} />;
            case 'perfil':         return <PerfilMedico user={user} />;
            default:               return <DashboardMedico user={user} onNavegar={handleNavegar} />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f3ee', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            {/* Overlay móvil para cerrar el sidebar */}
            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                        zIndex: 40, display: 'none'
                    }}
                    className="sidebar-overlay"
                />
            )}

            <SidebarMedico
                isOpen={isSidebarOpen}
                toggle={toggleSidebar}
                vistaActiva={vistaActiva}
                setVistaActiva={handleNavegar}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <NavbarMedico
                    user={user}
                    onToggleSidebar={toggleSidebar}
                    onLogout={handleLogout}
                    onNavegar={handleNavegar}
                />
                <main style={{ flex: 1, padding: '1.5rem', boxSizing: 'border-box', overflowY: 'auto' }}>
                    {renderVista()}
                </main>
            </div>
        </div>
    );
}