import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Card, Typography, TextField, Button, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Divider, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CampaignIcon from '@mui/icons-material/Campaign';

const API = 'http://localhost:8080';

export default function NotificacionesAdmin({ user }) {
    const [contactos, setContactos] = useState([]);
    const [chatSeleccionado, setChatSeleccionado] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('MEDICOS');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalBroadcast, setModalBroadcast] = useState(false);
    const [mensajeBroadcast, setMensajeBroadcast] = useState('');
    
    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    useEffect(() => {
        if (!user?.accessToken) return;
        const cfg = { headers: { Authorization: `Bearer ${user.accessToken}` } };
        
        const fetchContactos = async () => {
            try {
                if (filtroTipo === 'GENERAL') {
                    const [resMed, resEnf, resAdm] = await Promise.all([
                        axios.get(`${API}/api/usuarios/medicos`, cfg),
                        axios.get(`${API}/api/usuarios/enfermeras`, cfg),
                        axios.get(`${API}/api/usuarios/administrativos`, cfg)
                    ]);
                    setContactos([...resMed.data, ...resEnf.data, ...resAdm.data]);
                } else {
                    let url = filtroTipo === 'MEDICOS' ? '/api/usuarios/medicos' : '/api/usuarios/enfermeras';
                    const res = await axios.get(`${API}${url}`, cfg);
                    setContactos(res.data || []);
                }
                setChatSeleccionado(null);
                setSearchQuery('');
            } catch (error) {
                console.error("Error cargando contactos", error);
            }
        };
        fetchContactos();
    }, [filtroTipo, user]);

    useEffect(() => {
        if (!chatSeleccionado || !user?.accessToken) return;
        
        const cargarHistorial = async () => {
            try {
                const cfg = { headers: { Authorization: `Bearer ${user.accessToken}` } };
                const res = await axios.get(`${API}/api/notificaciones/chat/${chatSeleccionado.codUsuario}`, cfg);
                setMensajes(res.data.reverse());
                res.data.forEach(m => {
                    if (!m.leida && m.usuarioDestino?.codUsuario === user.codUsuario) {
                        axios.patch(`${API}/api/notificaciones/${m.id}/leer`, {}, cfg).catch(console.error);
                    }
                });
            } catch (error) {
                console.error("Error historial chat", error);
            }
        };

        cargarHistorial();
        const interval = setInterval(cargarHistorial, 5000);
        return () => clearInterval(interval);
    }, [chatSeleccionado, user]);

    const enviarMensaje = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || !chatSeleccionado) return;

        try {
            const cfg = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            const payload = { titulo: `Mensaje de Administración`, mensaje: nuevoMensaje.trim() };
            
            await axios.post(`${API}/api/notificaciones/usuario/${chatSeleccionado.codUsuario}`, payload, cfg);
            setNuevoMensaje('');
            
            const res = await axios.get(`${API}/api/notificaciones/chat/${chatSeleccionado.codUsuario}`, cfg);
            setMensajes(res.data.reverse());
        } catch (error) {
            console.error("Error al enviar", error);
            alert("No se pudo enviar el mensaje.");
        }
    };

    const enviarBroadcast = async () => {
        if (!mensajeBroadcast.trim()) return;
        try {
            const cfg = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            const payload = { titulo: `Anuncio General (${filtroTipo})`, mensaje: mensajeBroadcast.trim() };
            
            const rolBD = filtroTipo === 'MEDICOS' ? 'MEDICO' : (filtroTipo === 'ENFERMERAS' ? 'ENFERMERA' : 'GENERAL');
            await axios.post(`${API}/api/notificaciones/rol/${rolBD}`, payload, cfg);
            
            setModalBroadcast(false);
            setMensajeBroadcast('');
            alert(`Anuncio enviado exitosamente a: ${filtroTipo}`);
            
            if (chatSeleccionado) {
                const res = await axios.get(`${API}/api/notificaciones/chat/${chatSeleccionado.codUsuario}`, cfg);
                setMensajes(res.data.reverse());
            }
        } catch (error) {
            console.error("Error en broadcast", error);
            alert("Hubo un error al enviar el anuncio masivo.");
        }
    };

    const contactosFiltrados = contactos.filter(c => 
        c.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card sx={{ display: 'flex', height: '80vh', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(34, 41, 47, 0.08)', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            
            {/* Sidebar Contactos */}
            <Box sx={{ width: 320, display: 'flex', flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider', bgcolor: '#f8fafc' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>Comunicaciones</Typography>
                    
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color={filtroTipo === 'GENERAL' ? 'secondary' : 'primary'}
                        startIcon={<CampaignIcon />}
                        onClick={() => setModalBroadcast(true)}
                        sx={{ mb: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1 }}
                    >
                        Anuncio a {filtroTipo === 'MEDICOS' ? 'Médicos' : (filtroTipo === 'ENFERMERAS' ? 'Enfermeras' : 'Todo el Personal')}
                    </Button>

                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        <Button 
                            variant={filtroTipo === 'GENERAL' ? 'contained' : 'outlined'} 
                            fullWidth 
                            size="small"
                            onClick={() => setFiltroTipo('GENERAL')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', px: 0.5 }}
                        >
                            Todos
                        </Button>
                        <Button 
                            variant={filtroTipo === 'MEDICOS' ? 'contained' : 'outlined'} 
                            fullWidth 
                            size="small"
                            onClick={() => setFiltroTipo('MEDICOS')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', px: 0.5 }}
                        >
                            Médicos
                        </Button>
                        <Button 
                            variant={filtroTipo === 'ENFERMERAS' ? 'contained' : 'outlined'} 
                            fullWidth 
                            size="small"
                            onClick={() => setFiltroTipo('ENFERMERAS')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', px: 0.5 }}
                        >
                            Enferm.
                        </Button>
                    </Box>

                    <TextField 
                        fullWidth 
                        placeholder="Buscar personal..." 
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                            sx: { borderRadius: 3, bgcolor: '#f1f5f9' }
                        }}
                    />
                </Box>

                <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                    {contactosFiltrados.map(c => {
                        const isSelected = chatSeleccionado?.codUsuario === c.codUsuario;
                        return (
                            <ListItem 
                                button 
                                key={c.codUsuario} 
                                onClick={() => setChatSeleccionado(c)}
                                sx={{ 
                                    borderBottom: '1px solid', 
                                    borderColor: 'divider',
                                    bgcolor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                                    borderLeft: isSelected ? '4px solid #3b82f6' : '4px solid transparent',
                                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: isSelected ? 'primary.main' : 'grey.400' }}>
                                        {c.nombreCompleto.substring(0, 2).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={c.nombreCompleto} 
                                    secondary={filtroTipo === 'MEDICOS' ? 'Médico' : 'Enfermería'}
                                    primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500, color: '#0f172a' }}
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
                {chatSeleccionado ? (
                    <>
                        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', zIndex: 10 }}>
                            <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                                {chatSeleccionado.nombreCompleto.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{chatSeleccionado.nombreCompleto}</Typography>
                                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>● En línea</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {mensajes.length === 0 ? (
                                <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.6 }}>
                                    <Typography variant="h2" sx={{ mb: 2 }}>💬</Typography>
                                    <Typography variant="body1">No hay mensajes. ¡Inicia la conversación!</Typography>
                                </Box>
                            ) : (
                                mensajes.map(m => {
                                    const isMine = m.usuarioOrigen?.codUsuario === user.codUsuario;
                                    return (
                                        <Box key={m.id} sx={{ 
                                            alignSelf: isMine ? 'flex-end' : 'flex-start', 
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {!isMine && (
                                                <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#64748b', ml: 1, mb: 0.5 }}>
                                                    {m.usuarioOrigen?.nombre} {m.usuarioOrigen?.apellidos}
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
                                                {m.mensaje}
                                            </Box>
                                            <Typography variant="caption" sx={{ 
                                                fontSize: '0.7rem',
                                                mt: 0.5, 
                                                textAlign: 'right', 
                                                color: isMine ? 'text.secondary' : '#94a3b8',
                                                opacity: 0.8
                                            }}>
                                                {new Date(m.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        <Box component="form" onSubmit={enviarMensaje} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
                            <TextField 
                                fullWidth 
                                variant="outlined"
                                placeholder="Escribe un mensaje..."
                                value={nuevoMensaje}
                                onChange={(e) => setNuevoMensaje(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton color="primary" type="submit" disabled={!nuevoMensaje.trim()}>
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
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>Selecciona un contacto</Typography>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>Elige a un miembro del personal para enviar un mensaje.</Typography>
                    </Box>
                )}
            </Box>

            {/* Modal de Broadcast */}
            <Dialog open={modalBroadcast} onClose={() => setModalBroadcast(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CampaignIcon color="primary" /> 
                    Anuncio Masivo a {filtroTipo === 'MEDICOS' ? 'Médicos' : 'Enfermeras'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Escribe el mensaje que quieres enviar a **todos** los {filtroTipo.toLowerCase()} actualmente registrados en la clínica. Esto es ideal para reuniones o comunicados urgentes.
                    </Typography>
                    <TextField 
                        autoFocus
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Escribe el anuncio aquí..."
                        variant="outlined"
                        value={mensajeBroadcast}
                        onChange={(e) => setMensajeBroadcast(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setModalBroadcast(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancelar</Button>
                    <Button onClick={enviarBroadcast} variant="contained" color="primary" disabled={!mensajeBroadcast.trim()} sx={{ fontWeight: 600, borderRadius: 2 }}>
                        Enviar a Todos
                    </Button>
                </DialogActions>
            </Dialog>

        </Card>
    );
}
