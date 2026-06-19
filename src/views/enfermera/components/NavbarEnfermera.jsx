import React from 'react';
import { useNavbarEnfermera } from '../hooks/useNavbarEnfermera';
import styles from './NavbarEnfermera.module.css';

export default function NavbarEnfermera({ user }) {
    const { fechaActual, isLanActive } = useNavbarEnfermera(user?.accessToken);
    const nombreCompleto = user?.nombreCompleto || 'Enfermera';

    const handleLogout = () => {
        localStorage.removeItem('cam_user');
        window.location.href = '/';
    };

    return (
        <header className={styles.navbar}>
            <div className={styles.marcaContenedor}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#033323' }}>CAM Pucallya</h2>
                {isLanActive ? (
                    <span className={styles.estadoLan}>🟢 LAN Activa</span>
                ) : (
                    <span className={styles.estadoLan} style={{ color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                        🔴 Sin Conexión
                    </span>
                )}
            </div>

            <div className={styles.perfilSeccion}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{fechaActual}</span>
                <div className={styles.infoUsuario}>
                    <span>{nombreCompleto}</span>
                    <small>Enfermería y Triaje</small>
                </div>
                <button className={styles.btnSalir} onClick={handleLogout} title="Cerrar sesión">
                    Salir
                </button>
            </div>
        </header>
    );
}