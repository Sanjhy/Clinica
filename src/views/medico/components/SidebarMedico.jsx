import React from 'react';
import styles from './SidebarMedico.module.css';

export default function SidebarMedico({ isOpen, toggle, vistaActiva, setVistaActiva }) {

    const menuClinico = [
        { id: 'dashboard',     label: 'Dashboard',        icon: '📊' },
        { id: 'pacientes',     label: 'Pacientes',         icon: '👥' },
        { id: 'historial',     label: 'Historia clínica',  icon: '📝' },
        { id: 'triaje',        label: 'Triaje',            icon: '🩺' },
        { id: 'citas',         label: 'Citas',             icon: '📅' },
        { id: 'recetas',       label: 'Recetas',           icon: '💊' },
    ];

    const menuPersonal = [
        { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
        { id: 'perfil',         label: 'Mi Perfil',       icon: '👤' },
    ];

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
            {/* Logo / Título */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: '800', letterSpacing: '0.5px' }}>
                    🏥 CAM Pucallpa
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: '#6ee7b7', fontWeight: '500' }}>
                    Panel Médico
                </p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
                <div className={styles.seccionHeader}>Clínico</div>
                <nav style={{ display: 'flex', flexDirection: 'column' }}>
                    {menuClinico.map((item) => (
                        <button
                            key={item.id}
                            className={`${styles.menuItem} ${vistaActiva === item.id ? styles.menuItemActive : ''}`}
                            onClick={() => setVistaActiva(item.id)}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className={styles.seccionHeader} style={{ marginTop: '0.5rem' }}>Personal</div>
                <nav style={{ display: 'flex', flexDirection: 'column' }}>
                    {menuPersonal.map((item) => (
                        <button
                            key={item.id}
                            className={`${styles.menuItem} ${vistaActiva === item.id ? styles.menuItemActive : ''}`}
                            onClick={() => setVistaActiva(item.id)}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
}