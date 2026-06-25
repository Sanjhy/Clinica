import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, TextField, Button, Alert, Avatar, Switch, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const API = 'http://localhost:8080';

export default function PerfilMedico({ user }) {
    const [perfil, setPerfil] = useState({ nombre: '', apellidos: '' });
    const [pwd, setPwd] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });
    const [showPwd, setShowPwd] = useState({ actual: false, nueva: false, confirmar: false });
    const [guardando, setGuardando] = useState(false);
    const [cambiando, setCambiando] = useState(false);
    const [msgPerfil, setMsgPerfil] = useState(null);
    const [msgPwd, setMsgPwd] = useState(null);
    const [loading, setLoading] = useState(true);

    const dni = user?.dni || user?.username || '-';

    useEffect(() => {
        if (!user?.accessToken) return;
        const partes = (user.nombreCompleto || '').split(' ');
        const nombre = partes[0] || '';
        const apellidos = partes.slice(1).join(' ') || '';
        setPerfil({
            nombre,
            apellidos
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setLoading(false);
    }, [user]);

    const handlePerfil = (e) => {
        setPerfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setMsgPerfil(null);
    };

    const handlePwd = (e) => {
        setPwd(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setMsgPwd(null);
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        try {
            const res = await axios.put(`${API}/api/usuarios/perfil`, perfil, {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            });
            const session = JSON.parse(localStorage.getItem('cam_user') || '{}');
            localStorage.setItem('cam_user', JSON.stringify({
                ...session,
                nombreCompleto: res.data.nombreCompleto,
            }));
            setMsgPerfil({ ok: true, txt: 'Información personal actualizada correctamente.' });
        } catch {
            setMsgPerfil({ ok: false, txt: 'No se pudo guardar. Verifica tu conexión.' });
        } finally {
            setGuardando(false);
        }
    };

    const handleCambiarPwd = async (e) => {
        e.preventDefault();
        if (pwd.passwordNueva !== pwd.confirmar) {
            setMsgPwd({ ok: false, txt: 'Las nuevas contraseñas no coinciden.' });
            return;
        }
        if (pwd.passwordNueva.length < 6) {
            setMsgPwd({ ok: false, txt: 'La contraseña debe tener al menos 6 caracteres.' });
            return;
        }
        setCambiando(true);
        try {
            await axios.put(`${API}/api/usuarios/perfil/password`, {
                passwordActual: pwd.passwordActual,
                passwordNueva:  pwd.passwordNueva,
            }, { headers: { Authorization: `Bearer ${user?.accessToken}` } });
            setMsgPwd({ ok: true, txt: 'Contraseña cambiada exitosamente.' });
            setPwd({ passwordActual: '', passwordNueva: '', confirmar: '' });
        } catch (err) {
            const msg = err.response?.data?.error || 'Error cambiando la contraseña.';
            setMsgPwd({ ok: false, txt: msg });
        } finally {
            setCambiando(false);
        }
    };

    const iniciales = `${perfil.nombre[0] || ''}${perfil.apellidos[0] || ''}`.toUpperCase() || 'DR';

    if (loading) {
        return <Box sx={{ p: 4, textAlign: 'center', color: '#64748b' }}>Cargando perfil...</Box>;
    }

    // Light Theme Styles
    const lightTheme = {
        bg: '#f8fafc',
        cardBg: '#ffffff',
        border: '#e2e8f0',
        textMain: '#0f172a',
        textMuted: '#64748b',
        inputBg: '#ffffff',
        btnBg: '#f1f5f9',
        btnHover: '#e2e8f0',
        primary: '#3b82f6',
        error: '#ef4444'
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: lightTheme.inputBg,
            color: lightTheme.textMain,
            borderRadius: 1.5,
            '& fieldset': { borderColor: lightTheme.border },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: lightTheme.primary },
        },
        '& .MuiInputBase-input': {
            padding: '8px 12px',
            fontSize: '0.9rem'
        }
    };

    const labelStyles = {
        color: lightTheme.textMain,
        fontWeight: 600,
        fontSize: '0.9rem',
        mb: 1,
        display: 'block'
    };

    return (
        <Box sx={{ bgcolor: lightTheme.bg, minHeight: '100%', borderRadius: 3, p: { xs: 2, md: 5 }, color: lightTheme.textMain }}>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: lightTheme.textMain, borderBottom: `1px solid ${lightTheme.border}`, pb: 2 }}>
                    Ajustes de Perfil (Médico)
                </Typography>

                <Box sx={{ mb: 4, p: 2, border: `1px solid rgba(245, 158, 11, 0.4)`, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.05)', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <WarningAmberIcon sx={{ color: '#f59e0b' }} />
                    <Typography variant="body2" sx={{ color: lightTheme.textMain }}>
                        Estás viendo tu perfil como miembro del Personal Médico. Mantén tu información actualizada para los registros oficiales del Hospital CAM Pucallpa.
                    </Typography>
                </Box>

                {/* Avatar Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, p: 3, border: `1px solid ${lightTheme.border}`, borderRadius: 2, bgcolor: lightTheme.cardBg, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: lightTheme.primary, fontSize: '2rem', fontWeight: 600 }}>
                        {iniciales}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: lightTheme.textMain }}>{perfil.nombre} {perfil.apellidos}</Typography>
                        <Typography variant="body2" sx={{ color: lightTheme.textMuted }}>Médico • CAM Pucallpa</Typography>
                    </Box>
                </Box>

                {/* Personal Information */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: lightTheme.textMain }}>Información Personal</Typography>
                <Card sx={{ bgcolor: lightTheme.cardBg, border: `1px solid ${lightTheme.border}`, borderRadius: 2, mb: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    {msgPerfil && (
                        <Alert severity={msgPerfil.ok ? "success" : "error"} sx={{ m: 2 }}>
                            {msgPerfil.txt}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleGuardar} sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography component="label" sx={labelStyles}>DNI (Documento Nacional de Identidad)</Typography>
                            <Typography variant="body2" sx={{ color: lightTheme.textMuted, mb: 1 }}>
                                Este ID se usa para iniciar sesión en el sistema y no puede ser modificado.
                            </Typography>
                            <TextField 
                                fullWidth 
                                value={dni} 
                                disabled 
                                sx={{ ...inputStyles, '& .Mui-disabled': { WebkitTextFillColor: lightTheme.textMuted, bgcolor: '#f1f5f9' } }} 
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography component="label" sx={labelStyles}>Nombre(s)</Typography>
                                <TextField 
                                    fullWidth 
                                    name="nombre" 
                                    value={perfil.nombre} 
                                    onChange={handlePerfil} 
                                    sx={inputStyles} 
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography component="label" sx={labelStyles}>Apellidos</Typography>
                                <TextField 
                                    fullWidth 
                                    name="apellidos" 
                                    value={perfil.apellidos} 
                                    onChange={handlePerfil} 
                                    sx={inputStyles} 
                                />
                            </Box>
                        </Box>

                        <Button type="submit" disabled={guardando} variant="contained" sx={{ bgcolor: '#10b981', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#059669' }, '&.Mui-disabled': { bgcolor: 'rgba(16, 185, 129, 0.5)', color: 'rgba(255,255,255,0.5)' } }}>
                            {guardando ? 'Guardando...' : 'Guardar perfil'}
                        </Button>
                    </Box>
                </Card>

                {/* Privacy Toggle Section */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: lightTheme.textMain }}>Privacidad y Seguridad</Typography>
                <Card sx={{ bgcolor: lightTheme.cardBg, border: `1px solid ${lightTheme.border}`, borderRadius: 2, mb: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${lightTheme.border}` }}>
                        <Box pr={4}>
                            <Typography sx={{ fontWeight: 600, color: lightTheme.textMain }}>Mantener mis datos de contacto privados</Typography>
                            <Typography variant="body2" sx={{ color: lightTheme.textMuted, mt: 0.5 }}>
                                Removeremos tu perfil del directorio público del hospital. Solo los administradores podrán ver tu número de contacto.
                            </Typography>
                        </Box>
                        <Switch defaultChecked color="primary" />
                    </Box>
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box pr={4}>
                            <Typography sx={{ fontWeight: 600, color: lightTheme.textMain }}>Bloquear notificaciones administrativas</Typography>
                            <Typography variant="body2" sx={{ color: lightTheme.textMuted, mt: 0.5 }}>
                                Cuando activas esto, no recibirás los anuncios masivos por parte de la administración. (No recomendado)
                            </Typography>
                        </Box>
                        <Switch color="primary" />
                    </Box>
                </Card>

                {/* Change Password */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: lightTheme.textMain }}>Seguridad de cuenta</Typography>
                <Card sx={{ bgcolor: lightTheme.cardBg, border: `1px solid ${lightTheme.border}`, borderRadius: 2, mb: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    {msgPwd && (
                        <Alert severity={msgPwd.ok ? "success" : "error"} sx={{ m: 2 }}>
                            {msgPwd.txt}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleCambiarPwd} sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography component="label" sx={labelStyles}>Contraseña actual</Typography>
                            <TextField 
                                fullWidth 
                                type={showPwd.actual ? 'text' : 'password'}
                                name="passwordActual" 
                                value={pwd.passwordActual} 
                                onChange={handlePwd} 
                                sx={inputStyles}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPwd({...showPwd, actual: !showPwd.actual})} edge="end" sx={{ color: lightTheme.textMuted }}>
                                                {showPwd.actual ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography component="label" sx={labelStyles}>Nueva contraseña</Typography>
                            <TextField 
                                fullWidth 
                                type={showPwd.nueva ? 'text' : 'password'}
                                name="passwordNueva" 
                                value={pwd.passwordNueva} 
                                onChange={handlePwd} 
                                sx={inputStyles}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPwd({...showPwd, nueva: !showPwd.nueva})} edge="end" sx={{ color: lightTheme.textMuted }}>
                                                {showPwd.nueva ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography component="label" sx={labelStyles}>Confirmar nueva contraseña</Typography>
                            <TextField 
                                fullWidth 
                                type={showPwd.confirmar ? 'text' : 'password'}
                                name="confirmar" 
                                value={pwd.confirmar} 
                                onChange={handlePwd} 
                                sx={inputStyles}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPwd({...showPwd, confirmar: !showPwd.confirmar})} edge="end" sx={{ color: lightTheme.textMuted }}>
                                                {showPwd.confirmar ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                        <Button type="submit" disabled={cambiando} sx={{ bgcolor: lightTheme.btnBg, border: `1px solid ${lightTheme.border}`, color: lightTheme.textMain, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: lightTheme.btnHover }, '&.Mui-disabled': { color: 'rgba(0,0,0,0.3)' } }}>
                            {cambiando ? 'Actualizando...' : 'Cambiar contraseña'}
                        </Button>
                    </Box>
                </Card>

            </Box>
        </Box>
    );
}
