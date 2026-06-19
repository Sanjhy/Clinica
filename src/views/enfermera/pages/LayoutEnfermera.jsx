import React, { useState } from 'react';
import NavbarEnfermera from '../components/NavbarEnfermera';
import SidebarEnfermera from '../components/SidebarEnfermera';
import DashboardEnfermera from './DashboardEnfermera';
import PacienteEnfermera from './PacienteEnfermera';
import TriajeFormEnfermera from './TriajeFormEnfermera';
import CitasEnfermera from './CitasEnfermera';
import NotificacionesEnf from './NotificacionesEnf';
import HistorialEnfermera from './HistorialEnfermera';
import PerfilEnfermera from './PerfilEnfermera';

export default function LayoutEnfermera() {
    const [vistaActiva, setVistaActiva] = useState('dashboard');
    const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState(null);
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    const savedUser = JSON.parse(localStorage.getItem('cam_user') || '{}');

    const irATriaje = (pacienteId) => {
        setPacienteSeleccionadoId(pacienteId);
        setVistaActiva('triaje');
    };

    const irAHistorial = (pacienteId) => {
        setPacienteSeleccionadoId(pacienteId);
        setVistaActiva('historial');
    };

    const renderContent = () => {
        switch (vistaActiva) {
            case 'dashboard':
                return <DashboardEnfermera user={savedUser} onAccion={irATriaje} />;
            case 'pacientes':
                return <PacienteEnfermera user={savedUser} onVerDatos={irAHistorial} onHacerTriaje={irATriaje} />;
            case 'triaje':
                return <TriajeFormEnfermera user={savedUser} pacienteId={pacienteSeleccionadoId} alTerminar={() => setVistaActiva('dashboard')} />;
            case 'citas':
                return <CitasEnfermera user={savedUser} onHacerTriaje={irATriaje} />;
            case 'historial':
                return <HistorialEnfermera user={savedUser} pacienteId={pacienteSeleccionadoId} />;
            case 'notificaciones':
                return <NotificacionesEnf user={savedUser} />;
            case 'perfil':
                return <PerfilEnfermera user={savedUser} />;
            default:
                return <DashboardEnfermera user={savedUser} onAccion={irATriaje} />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <SidebarEnfermera
                vistaActiva={vistaActiva}
                setVistaActiva={(v) => { setVistaActiva(v); }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <NavbarEnfermera user={savedUser} />
                <main style={{ flex: 1, padding: 'clamp(1rem,3vw,1.75rem)', boxSizing: 'border-box' }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}