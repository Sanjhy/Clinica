import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../../components/MainLayout';
import DashboardAdmin from './DashboardAdmin';
import GestionPersonal from './GestionPersonal';
import NotificacionesAdmin from './NotificacionesAdmin';
import InventarioFarmacia from './InventarioFarmacia';
import PerfilAdmin from './PerfilAdmin';

// Importar Íconos de MUI
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupIcon from '@mui/icons-material/Group';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ChatIcon from '@mui/icons-material/Chat';

const adminMenu = [
    { id: 'dashboard', label: 'Dashboard General', icon: <DashboardIcon /> },
    { type: 'header', label: 'Gestión Institucional' },
    { 
        id: 'institucion', 
        label: 'Administración', 
        icon: <LocalHospitalIcon />,
        subitems: [
            { id: 'gestion-personal', label: 'Gestión de Personal', icon: <GroupIcon fontSize="small" /> },
            { id: 'farmacia', label: 'Farmacia e Inventario', icon: <LocalPharmacyIcon fontSize="small" /> }
        ]
    },
    { type: 'header', label: 'Comunicaciones' },
    { id: 'notificaciones', label: 'Chat Interno', icon: <ChatIcon /> }
];

export default function LayoutAdmin() {
    const [searchParams, setSearchParams] = useSearchParams();
    const vistaActiva = searchParams.get('vista') || 'dashboard';
    const [user] = useState(() => JSON.parse(localStorage.getItem('cam_user') || '{}'));

    const handleNavegar = (vista) => {
        setSearchParams({ vista });
    };

    const renderVista = () => {
        switch (vistaActiva) {
            case 'dashboard': return <DashboardAdmin user={user} onNavegar={handleNavegar} />;
            case 'gestion-personal': return <GestionPersonal user={user} />;
            case 'farmacia': return <InventarioFarmacia user={user} />;
            case 'notificaciones': return <NotificacionesAdmin user={user} />;
            case 'perfil': return <PerfilAdmin user={user} />;
            default: return <DashboardAdmin user={user} onNavegar={handleNavegar} />;
        }
    };

    return (
        <MainLayout 
            menu={adminMenu} 
            title="CAM Pucallpa (Admin)" 
            activeView={vistaActiva} 
            setActiveView={handleNavegar}
        >
            {renderVista()}
        </MainLayout>
    );
}
