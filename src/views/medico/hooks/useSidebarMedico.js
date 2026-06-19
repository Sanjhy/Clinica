import { useState } from 'react';

export function useSidebarMedico() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('dashboard'); // Pestaña inicial

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return {
        isSidebarOpen,
        toggleSidebar,
        vistaActiva,
        setVistaActiva
    };
}