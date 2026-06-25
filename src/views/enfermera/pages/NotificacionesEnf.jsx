import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Card, Typography, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';

export default function NotificacionesEnf({ user }) {
    const [contactos, setContactos] = useState([]);
    const [rolDestino, setRolDestino] = useState('MEDICO');
    const [busqueda, setBusqueda] = useState('');
    
    // chatActivo: { tipo: 'GRUPO' | 'DM', id: string|number, nombre: string, avatar: string }
    const [chatActivo, setChatActivo] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    
    const mensajesEndRef = useRef(null);

    // Cargar contactos cuando cambia el rol
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
                let res;
                if (rolDestino === 'MEDICO') {
                    res = await axios.get('http://localhost:8080/api/usuarios/medicos', config);
                } else if (rolDestino === 'ADMINISTRATIVO') {
                    res = await axios.get('http://localhost:8080/api/usuarios/administrativos', config);
                } else {
                    res = { data: [] };
                }
                setContactos(res.data || []);
            } catch (e) {
                console.error("Error al cargar contactos", e);
            }
        };
        fetchUsuarios();
        setChatActivo(null); // Reset chat
    }, [rolDestino, user]);

    // Cargar historial de chat
    const scrollToBottom = () => {
        setTimeout(() => {
            mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const fetchHistorial = async () => {
        if (!chatActivo || !user?.accessToken) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            let url = '';
            if (chatActivo.tipo === 'GRUPO') {
                url = `http://localhost:8080/api/notificaciones/chat/grupo/${chatActivo.id}`;
            } else {
                url = `http://localhost:8080/api/notificaciones/chat/${chatActivo.id}`;
            }
            const res = await axios.get(url, config);
            setHistorial(res.data || []);
            scrollToBottom();
        } catch (e) {
            console.error("Error al cargar historial", e);
        }
    };

    useEffect(() => {
        fetchHistorial();
        const interval = setInterval(fetchHistorial, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatActivo, user]);

    const enviarMensaje = async (e) => {
        e.preventDefault();
        if (!mensaje.trim() || !chatActivo) return;
        
        setEnviando(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            let url = '';
            if (chatActivo.tipo === 'GRUPO') {
                url = `http://localhost:8080/api/notificaciones/rol/${chatActivo.id}`;
            } else {
                url = `http://localhost:8080/api/notificaciones/usuario/${chatActivo.id}`;
            }
            
            await axios.post(url, { titulo: 'Mensaje', mensaje }, config);
            
            setMensaje('');
            fetchHistorial(); 
        } catch (err) {
            console.error("Error al enviar", err);
        } finally {
            setEnviando(false);
        }
    };

    const terminosBusqueda = busqueda.toLowerCase().trim().split(/\s+/);
    const contactosFiltrados = contactos.filter(c => {
        if (!busqueda.trim()) return true;
        const nombreStr = (c.nombreCompleto || c.nombre || '').toLowerCase();
        return terminosBusqueda.every(term => nombreStr.includes(term));
    });

    return (
        <Card sx={{ display: 'flex', height: '80vh', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(34, 41, 47, 0.08)', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            
            {/* Sidebar Contactos */}
            <Box sx={{ width: 320, display: 'flex', flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider', bgcolor: '#f8fafc' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>Nuevo Mensaje</Typography>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        <Button 
                            variant={rolDestino === 'MEDICO' ? 'contained' : 'outlined'} 
                            fullWidth 
                            size="small"
                            onClick={() => setRolDestino('MEDICO')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', px: 0.5 }}
                        >
                            Médicos
                        </Button>
                        <Button 
                            variant={rolDestino === 'ADMINISTRATIVO' ? 'contained' : 'outlined'} 
                            fullWidth 
                            size="small"
                            onClick={() => setRolDestino('ADMINISTRATIVO')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', px: 0.5 }}
                        >
                            Administración
                        </Button>
                    </Box>

                    <TextField 
                        fullWidth 
                        placeholder="Buscar por nombre..." 
                        size="small"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                            sx: { borderRadius: 3, bgcolor: '#f1f5f9' }
                        }}
                    />
                </Box>

                <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                    {/* Opción de TODO EL PERSONAL (GENERAL) */}
                    <ListItem 
                        button 
                        onClick={() => setChatActivo({ tipo: 'GRUPO', id: 'GENERAL', nombre: 'General (Clínica)', avatar: '📢' })}
                        sx={{ 
                            borderBottom: '1px solid', borderColor: 'divider',
                            bgcolor: chatActivo?.id === 'GENERAL' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                            borderLeft: chatActivo?.id === 'GENERAL' ? '4px solid #f59e0b' : '4px solid transparent',
                            '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.04)' }
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>📢</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                            primary="General (Clínica)" 
                            secondary="Anuncios para todo el personal"
                            primaryTypographyProps={{ fontWeight: chatActivo?.id === 'GENERAL' ? 800 : 600, color: '#92400e' }}
                            secondaryTypographyProps={{ color: '#b45309', fontSize: '0.75rem' }}
                        />
                    </ListItem>

                    {/* Opción de STAFF MEDICO (Medicos + Enfermeras) */}
                    <ListItem 
                        button 
                        onClick={() => setChatActivo({ tipo: 'GRUPO', id: 'STAFF_MEDICO', nombre: 'Staff Médico (M/E)', avatar: '⚕️' })}
                        sx={{ 
                            borderBottom: '1px solid', borderColor: 'divider',
                            bgcolor: chatActivo?.id === 'STAFF_MEDICO' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                            borderLeft: chatActivo?.id === 'STAFF_MEDICO' ? '4px solid #10b981' : '4px solid transparent',
                            '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.04)' }
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>⚕️</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                            primary="Staff Médico (M/E)" 
                            secondary="Coordinación Médicos/Enfermeras"
                            primaryTypographyProps={{ fontWeight: chatActivo?.id === 'STAFF_MEDICO' ? 800 : 600, color: '#065f46' }}
                            secondaryTypographyProps={{ color: '#047857', fontSize: '0.75rem' }}
                        />
                    </ListItem>

                    {/* Opción de Grupo Interno (ENFERMERAS) */}
                    <ListItem 
                        button 
                        onClick={() => setChatActivo({ tipo: 'GRUPO', id: 'ENFERMERA', nombre: 'General Enfermeras', avatar: '👩‍⚕️' })}
                        sx={{ 
                            borderBottom: '1px solid', borderColor: 'divider',
                            bgcolor: chatActivo?.id === 'ENFERMERA' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                            borderLeft: chatActivo?.id === 'ENFERMERA' ? '4px solid #3b82f6' : '4px solid transparent',
                            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' }
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: chatActivo?.id === 'ENFERMERA' ? '#3b82f6' : 'grey.400' }}>👩‍⚕️</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                            primary="General Enfermeras" 
                            secondary="Chat del Departamento"
                            primaryTypographyProps={{ fontWeight: chatActivo?.id === 'ENFERMERA' ? 700 : 500, color: '#0f172a' }}
                        />
                    </ListItem>

                    {/* Lista de Personas */}
                    {contactosFiltrados.map(c => {
                        const iniciales = (c.nombre?.charAt(0) || '') + (c.apellidos?.charAt(0) || '');
                        const isActive = chatActivo?.tipo === 'DM' && chatActivo?.id === c.codUsuario;
                        return (
                            <ListItem 
                                button 
                                key={c.codUsuario} 
                                onClick={() => setChatActivo({ tipo: 'DM', id: c.codUsuario, nombre: c.nombreCompleto || c.nombre, avatar: iniciales })}
                                sx={{ 
                                    borderBottom: '1px solid', 
                                    borderColor: 'divider',
                                    bgcolor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                                    borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: isActive ? 'primary.main' : 'grey.400' }}>
                                        {iniciales.toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={c.nombreCompleto || c.nombre} 
                                    secondary={c.email || 'Sin correo'}
                                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, color: '#0f172a' }}
                                />
                            </ListItem>
                        );
                    })}
                    {contactosFiltrados.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No hay personal encontrado.</Typography>
                        </Box>
                    )}
                </List>
            </Box>

            {/* Zona de Chat */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
                {chatActivo ? (
                    <>
                        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', zIndex: 10 }}>
                            <Avatar sx={{ bgcolor: chatActivo.tipo === 'GRUPO' ? 'secondary.main' : '#3b82f6', mr: 2 }}>
                                {chatActivo.avatar}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{chatActivo.nombre}</Typography>
                                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>{chatActivo.tipo === 'GRUPO' ? 'Chat de difusión' : '● En línea'}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {historial.length === 0 ? (
                                <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.6 }}>
                                    <Typography variant="h2" sx={{ mb: 2 }}>💬</Typography>
                                    <Typography variant="body1">No hay mensajes. ¡Inicia la conversación!</Typography>
                                </Box>
                            ) : (
                                historial.map((msg, index) => {
                                    const isMine = msg.emisor && msg.emisor.codUsuario === user?.codUsuario;
                                    return (
                                        <Box key={msg.codNotificacion || index} sx={{ 
                                            alignSelf: isMine ? 'flex-end' : 'flex-start', 
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {!isMine && (
                                                <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#64748b', ml: 1, mb: 0.5 }}>
                                                    {msg.emisor ? (msg.emisor.nombre + ' ' + msg.emisor.apellidos) : 'Sistema'}
                                                </Typography>
                                            )}
                                            <Box sx={{ 
                                                px: 2,
                                                py: 1.5,
                                                borderRadius: '12px',
                                                bgcolor: isMine ? '#0ea5e9' : '#fff',
                                                color: isMine ? '#fff' : '#1e293b',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                border: isMine ? 'none' : '1px solid #e2e8f0',
                                                borderBottomRightRadius: isMine ? '4px' : '12px',
                                                borderBottomLeftRadius: isMine ? '12px' : '4px',
                                                fontSize: '0.95rem',
                                                lineHeight: 1.4
                                            }}>
                                                {msg.mensaje}
                                            </Box>
                                            <Typography variant="caption" sx={{ 
                                                fontSize: '0.7rem',
                                                mt: 0.5, 
                                                textAlign: 'right', 
                                                color: isMine ? 'text.secondary' : '#94a3b8',
                                                opacity: 0.8
                                            }}>
                                                {new Date(msg.fecha || msg.fechaCreacion || new Date().toISOString()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    );
                                })
                            )}
                            <div ref={mensajesEndRef} />
                        </Box>

                        <Box component="form" onSubmit={enviarMensaje} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
                            <TextField 
                                fullWidth 
                                variant="outlined"
                                placeholder="Escribe un mensaje..."
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton color="primary" type="submit" disabled={!mensaje.trim() || enviando}>
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 4, bgcolor: '#f8fafc' }
                                }}
                            />
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: '#f8fafc' }}>
                        <Typography variant="h1" sx={{ mb: 2, opacity: 0.5 }}>🗣️</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>Selecciona una conversación</Typography>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>Elige un grupo o persona de la lista para empezar a chatear.</Typography>
                    </Box>
                )}
            </Box>
        </Card>
    );
}