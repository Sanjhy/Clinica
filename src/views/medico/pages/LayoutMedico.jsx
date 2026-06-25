import { useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import MainLayout from '../../../components/MainLayout';
import DashboardMedico from './DashboardMedico';
import PacienteMedico from './PacienteMedico';
import TriajeMedico from './TriajeMedico';
import HistorialClinicoMedico from './HistorialClinicoMedico';
import CitasMedico from './CitasMedico';
import RecetasMedico from './RecetasMedico';
import NotificacionesMedico from './NotificacionesMedico';
import PerfilMedico from './PerfilMedico';

import DashboardIcon from '@mui/icons-material/Dashboard';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';

const medicoMenu = [
    { id: 'dashboard', label: 'Inicio', icon: <DashboardIcon /> },
    { type: 'header', label: 'Atención Médica' },
    { 
        id: 'pacientes-menu', 
        label: 'Mis Pacientes', 
        icon: <GroupsIcon />,
        subitems: [
            { id: 'pacientes', label: 'Lista de Pacientes', icon: <GroupsIcon fontSize="small" /> },
            { id: 'historial', label: 'Historial Médico', icon: <AssignmentIcon fontSize="small" /> },
            { id: 'recetas', label: 'Recetas', icon: <ReceiptIcon fontSize="small" /> }
        ]
    },
    { 
        id: 'consultorio', 
        label: 'Consultorio', 
        icon: <VaccinesIcon />,
        subitems: [
            { id: 'citas', label: 'Mi Agenda', icon: <CalendarMonthIcon fontSize="small" /> },
            { id: 'triaje', label: 'Triaje', icon: <MedicalInformationIcon fontSize="small" /> }
        ]
    },
    { type: 'header', label: 'Personal' },
    { id: 'notificaciones', label: 'Chat Interno', icon: <ChatIcon /> },
    { id: 'perfil', label: 'Mi Perfil', icon: <PersonIcon /> }
];

export default function LayoutMedico() {
    const [searchParams, setSearchParams] = useSearchParams();
    const vistaActiva = searchParams.get('vista') || 'dashboard';
    const [user] = useState(() => JSON.parse(localStorage.getItem('cam_user') || '{}'));

    const handleNavegar = (vista) => {
        setSearchParams({ vista });
    };

    const renderVista = () => {
        switch (vistaActiva) {
            case 'dashboard':      return <DashboardMedico user={user} onNavegar={handleNavegar} />;
            case 'pacientes':      return <PacienteMedico user={user} onNavegar={handleNavegar} />;
            case 'historial':      return <HistorialClinicoMedico user={user} onNavegar={handleNavegar} />;
            case 'triaje':         return <TriajeMedico user={user} onNavegar={handleNavegar} />;
            case 'citas':          return <CitasMedico user={user} onNavegar={handleNavegar} />;
            case 'recetas':        return <RecetasMedico user={user} onNavegar={handleNavegar} />;
            case 'notificaciones': return <NotificacionesMedico user={user} onNavegar={handleNavegar} />;
            case 'perfil':         return <PerfilMedico user={user} onNavegar={handleNavegar} />;
            default:               return <DashboardMedico user={user} onNavegar={handleNavegar} />;
        }
    };

    return (
        <MainLayout 
            menu={medicoMenu} 
            title="CAM Pucallpa (Médico)" 
            activeView={vistaActiva} 
            setActiveView={handleNavegar}
        >
            {renderVista()}
        </MainLayout>
    );
}