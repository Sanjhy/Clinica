import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../../components/MainLayout';
import DashboardEnfermera from './DashboardEnfermera';
import PacienteEnfermera from './PacienteEnfermera';
import TriajeFormEnfermera from './TriajeFormEnfermera';
import CitasEnfermera from './CitasEnfermera';
import HistorialEnfermera from './HistorialEnfermera';
import NotificacionesEnf from './NotificacionesEnf';
import PerfilEnfermera from './PerfilEnfermera';

import DashboardIcon from '@mui/icons-material/Dashboard';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';

const enfermeraMenu = [
    { id: 'dashboard', label: 'Dashboard General', icon: <DashboardIcon /> },
    { type: 'header', label: 'Gestión Clínica' },
    { 
        id: 'clinico-menu', 
        label: 'Operaciones', 
        icon: <VaccinesIcon />,
        subitems: [
            { id: 'pacientes', label: 'Pacientes', icon: <GroupsIcon fontSize="small" /> },
            { id: 'triaje', label: 'Triaje', icon: <MedicalInformationIcon fontSize="small" /> },
            { id: 'citas', label: 'Citas', icon: <CalendarMonthIcon fontSize="small" /> },
            { id: 'historial', label: 'Historial Clínico', icon: <AssignmentIcon fontSize="small" /> }
        ]
    },
    { type: 'header', label: 'Personal' },
    { id: 'notificaciones', label: 'Chat Interno', icon: <ChatIcon /> },
    { id: 'perfil', label: 'Mi Perfil', icon: <PersonIcon /> }
];

export default function LayoutEnfermera() {
    const [searchParams, setSearchParams] = useSearchParams();
    const vistaActiva = searchParams.get('vista') || 'dashboard';
    const pacienteSeleccionadoId = searchParams.get('pacienteId') ? parseInt(searchParams.get('pacienteId'), 10) : null;
    const [user] = useState(() => JSON.parse(localStorage.getItem('cam_user') || '{}'));

    const setVistaActiva = (vista, pacienteId = null) => {
        const params = { vista };
        if (pacienteId) params.pacienteId = pacienteId.toString();
        setSearchParams(params);
    };

    const irATriaje = (pacienteId) => setVistaActiva('triaje', pacienteId);
    const irAHistorial = (pacienteId) => setVistaActiva('historial', pacienteId);

    const renderVista = () => {
        switch (vistaActiva) {
            case 'dashboard':
                return <DashboardEnfermera user={user} onAccion={irATriaje} />;
            case 'pacientes':
                return <PacienteEnfermera user={user} onVerDatos={irAHistorial} onHacerTriaje={irATriaje} />;
            case 'triaje':
                return <TriajeFormEnfermera user={user} pacienteId={pacienteSeleccionadoId} alTerminar={() => setVistaActiva('dashboard')} />;
            case 'citas':
                return <CitasEnfermera user={user} onHacerTriaje={irATriaje} />;
            case 'historial':
                return <HistorialEnfermera user={user} pacienteId={pacienteSeleccionadoId} />;
            case 'notificaciones':
                return <NotificacionesEnf user={user} />;
            case 'perfil':
                return <PerfilEnfermera user={user} />;
            default:
                return <DashboardEnfermera user={user} onAccion={irATriaje} />;
        }
    };

    return (
        <MainLayout 
            menu={enfermeraMenu} 
            title="CAM Pucallpa (Enfermería)" 
            activeView={vistaActiva} 
            setActiveView={setVistaActiva}
        >
            {renderVista()}
        </MainLayout>
    );
}