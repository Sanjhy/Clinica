import React from 'react';
import styles from './NavbarMedico.module.css';

export default function NavbarMedico({ user, onToggleSidebar, onLogout, onNavegar }) {
    // El backend devuelve 'nombreCompleto' en el AuthResponse
    const nombreCompleto = user?.nombreCompleto || 'Dr. Médico';

    return (
        <header className={styles.navbar}>
            {/* Zona izquierda */}
            <div className={styles.leftSection}>
                <button className={styles.hamburgerBtn} onClick={onToggleSidebar} aria-label="Abrir menú">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <h2 className={styles.clinicaTitle}>CAM Pucallya</h2>
                <span className={styles.redStatus}>🟢 En línea</span>
            </div>

            {/* Zona derecha */}
            <div className={styles.rightSection}>
                <span className={styles.badgeMedico}>🩺 Médico</span>
                <button
                    className={styles.medicoName}
                    onClick={() => onNavegar && onNavegar('perfil')}
                    title="Ver mi perfil"
                >
                    {nombreCompleto}
                </button>
                <button className={styles.salirBtn} onClick={onLogout} title="Cerrar sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className={styles.salirTexto}>Salir</span>
                </button>
            </div>
        </header>
    );
}