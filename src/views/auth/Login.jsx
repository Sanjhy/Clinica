import React from 'react';
import { useLogin } from './useLogin';
import styles from './Login.module.css';

export default function Login() {
    const {
        username,
        setUsername,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        error,
        loading,
        handleLogin
    } = useLogin();

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                
                <div className={styles.iconWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                </div>

                <h1 className={styles.title}>CAM Pucallpa</h1>
                <p className={styles.subtitle}>Plataforma clínica · Red LAN</p>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleLogin}>
                    {/* Input DNI */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Usuario</label>
                        <input 
                            type="text" 
                            className={styles.input}
                            placeholder="Ingrese su DNI"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={8}
                            required
                        />
                    </div>

                    {/* Input Contraseña + Ojo interactivo */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Contraseña</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingRight: '2.5rem' }} // Espacio para que el texto no tape al ojo
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#888888',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? (
                                    /* Ícono Ojo Abierto */
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                ) : (
                                    /* Ícono Ojo Cerrado / Tachado */
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                            <polyline points="10 17 15 12 10 7"/>
                            <line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                        {loading ? 'Autenticando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <p className={styles.footerText}>Sistema LAN · Sin acceso a internet requerido</p>
            </div>
        </div>
    );
}