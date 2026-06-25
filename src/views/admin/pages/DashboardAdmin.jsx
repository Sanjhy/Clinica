import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, Chip, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, List } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MasksIcon from '@mui/icons-material/Masks';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import '../../../styles/admin/DashboardAdmin.css';

const API = 'http://localhost:8080';

export default function DashboardAdmin({ user, onNavegar }) {
    const [stats, setStats] = useState({ pacientes: 0, medicos: 0, enfermeras: 0 });
    const [flujo, setFlujo] = useState({ enEspera: 0, enConsultorio: 0, atendidos: 0 });
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.accessToken) return;
        const cfg = { headers: { Authorization: `Bearer ${user.accessToken}` } };
        
        Promise.all([
            axios.get(`${API}/api/pacientes`, cfg).catch(() => ({ data: [] })),
            axios.get(`${API}/api/usuarios/medicos`, cfg).catch(() => ({ data: [] })),
            axios.get(`${API}/api/usuarios/enfermeras`, cfg).catch(() => ({ data: [] })),
            axios.get(`${API}/api/dashboard/admin/flujo`, cfg).catch(() => ({ data: { enEspera: 0, enConsultorio: 0, atendidos: 0 } })),
            axios.get(`${API}/api/inventario`, cfg).catch(() => ({ data: [] }))
        ]).then(([resPac, resMed, resEnf, resFlujo, resInv]) => {
            setStats({
                pacientes: resPac.data.length || 0,
                medicos: resMed.data.length || 0,
                enfermeras: resEnf.data.length || 0
            });
            setFlujo(resFlujo.data);
            setInventario(resInv.data);
        }).finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return (
            <Box className="dashboard-loading">
                <Typography variant="h5" color="text.secondary">Cargando métricas clínicas...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box className="dashboard-header">
                <Box>
                    <Typography variant="h3" className="dashboard-title">
                        Panel de Administración General
                    </Typography>
                    <Typography variant="h6" className="dashboard-subtitle">
                        Supervisión y métricas de CAM Pucallpa (Clínica del Estado)
                    </Typography>
                </Box>
                <Button variant="contained" color="primary" onClick={() => onNavegar('gestion-personal')} className="btn-gestionar-personal">
                    + Gestionar Personal
                </Button>
            </Box>

            {/* Tarjetas Principales */}
            <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card">
                        <Avatar sx={{ bgcolor: 'info.lighter', color: 'info.main', width: 64, height: 64, mb: 2 }}>
                            <GroupsIcon sx={{ fontSize: 36 }} />
                        </Avatar>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary" className="stat-card-title">Total Pacientes</Typography>
                            <Typography variant="h3" className="stat-card-value">{stats.pacientes}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card">
                        <Avatar sx={{ bgcolor: 'success.lighter', color: 'success.main', width: 64, height: 64, mb: 2 }}>
                            <LocalHospitalIcon sx={{ fontSize: 36 }} />
                        </Avatar>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary" className="stat-card-title">Médicos Activos</Typography>
                            <Typography variant="h3" className="stat-card-value">{stats.medicos}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card">
                        <Avatar sx={{ bgcolor: 'warning.lighter', color: 'warning.dark', width: 64, height: 64, mb: 2 }}>
                            <MasksIcon sx={{ fontSize: 36 }} />
                        </Avatar>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary" className="stat-card-title">Enfermería</Typography>
                            <Typography variant="h3" className="stat-card-value">{stats.enfermeras}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card">
                        <Avatar sx={{ bgcolor: 'error.lighter', color: 'error.main', width: 64, height: 64, mb: 2 }}>
                            <CoronavirusIcon sx={{ fontSize: 36 }} />
                        </Avatar>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary" className="stat-card-title">Alertas Dengue</Typography>
                            <Typography variant="h3" className="stat-card-value">2</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
    {/* Flujo de Pacientes */}
    <Grid item xs={12}>
        <Card className="section-card">
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Flujo de Atención</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className="table-header-cell">Estado del Paciente</TableCell>
                                <TableCell align="right" className="table-header-cell">Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <TableCell><Typography variant="body2" fontWeight="600">En Espera (Triaje / Recepción)</Typography></TableCell>
                                <TableCell align="right"><Chip label={flujo.enEspera} color="error" size="small" sx={{ fontWeight: 700, minWidth: 40 }} /></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><Typography variant="body2" fontWeight="600">En Consultorio Médico</Typography></TableCell>
                                <TableCell align="right"><Chip label={flujo.enConsultorio} color="warning" size="small" sx={{ fontWeight: 700, minWidth: 40 }} /></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><Typography variant="body2" fontWeight="600">Atendidos Completamente</Typography></TableCell>
                                <TableCell align="right"><Chip label={flujo.atendidos} color="success" size="small" sx={{ fontWeight: 700, minWidth: 40 }} /></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    </Grid>

    {/* Resumen Farmacia */}
    <Grid item xs={12}>
        <Card className="section-card section-card-farmacia">
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VaccinesIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Farmacia MINSA</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Medicamentos críticos con bajo stock.
                </Typography>
                
                <List sx={{ p: 0 }}>
                    {inventario.filter(i => i.estado === 'Crítico' || i.estado === 'Bajo').length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3, width: '100%' }}>No hay medicamentos en estado crítico.</Typography>
                    ) : (
                        inventario.filter(i => i.estado === 'Crítico' || i.estado === 'Bajo').map(item => (
                            <Box key={item.id} className="list-item-farmacia">
                                <Typography variant="body2" fontWeight="600">{item.nombre}</Typography>
                                <Chip label={`${item.estado} (${item.stock})`} size="small" color={item.estado === 'Crítico' ? 'error' : 'warning'} sx={{ fontWeight: 700 }} />
                            </Box>
                        ))
                    )}
                </List>
            </CardContent>
            <Box className="farmacia-footer">
                <Button fullWidth onClick={() => onNavegar('farmacia')} className="btn-farmacia">
                    Gestionar Inventario →
                </Button>
            </Box>
        </Card>
    </Grid>
            </Grid>
        </Box>
    );
}
