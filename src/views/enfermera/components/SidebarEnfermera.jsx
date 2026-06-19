import React from 'react';
import styles from './SidebarEnfermera.module.css';

const menuClinico = [
    { id: 'dashboard',     label: 'Dashboard',        icon: '📊' },
    { id: 'pacientes',     label: 'Pacientes',         icon: '👥' },
    { id: 'triaje',        label: 'Triaje',            icon: '🩺' },
    { id: 'citas',         label: 'Citas',             icon: '📅' },
    { id: 'historial',     label: 'Historial Clínico', icon: '📋' },
];

const menuPersonal = [
    { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
    { id: 'perfil',         label: 'Mi Perfil',       icon: '👤' },
];

export default function SidebarEnfermera({ vistaActiva, setVistaActiva }) {
    return (
        <aside className={styles.sidebar}>
            {/* Cabecera */}
            <div style={{ padding: '1.5rem 1.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>CAM Pucallpa</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#38bdf8' }}>✨ Panel de Enfermería</p>
            </div>

            {/* Módulos clínicos */}
            <div className={styles.seccionHeader}>Clínico</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {menuClinico.map(item => (
                    <button
                        key={item.id}
                        className={`${styles.menuItem} ${vistaActiva === item.id ? styles.menuItemActive : ''}`}
                        onClick={() => setVistaActiva(item.id)}
                    >
                        <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Personal */}
            <div className={styles.seccionHeader}>Personal</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {menuPersonal.map(item => (
                    <button
                        key={item.id}
                        className={`${styles.menuItem} ${vistaActiva === item.id ? styles.menuItemActive : ''}`}
                        onClick={() => setVistaActiva(item.id)}
                    >
                        <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}