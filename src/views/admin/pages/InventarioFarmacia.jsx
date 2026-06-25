import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Chip, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const API = 'http://localhost:8080';

export default function InventarioFarmacia({ user }) {
    const [busqueda, setBusqueda] = useState('');
    const [inventario, setInventario] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', tipo: 'Tabletas', stock: '', minStock: '' });

    const cargarInventario = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            const res = await axios.get(`${API}/api/inventario`, config);
            setInventario(res.data);
        } catch (error) {
            console.error('Error cargando inventario', error);
        }
    };

    useEffect(() => {
        if (user?.accessToken) cargarInventario();
    }, [user]);

    const filtrados = inventario.filter(item => item.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const getEstadoColor = (estado) => {
        if (estado === 'Óptimo') return 'success';
        if (estado === 'Bajo') return 'warning';
        return 'error';
    };

    const handleOpen = () => {
        setFormData({ nombre: '', tipo: 'Tabletas', stock: '', minStock: '' });
        setOpenModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            await axios.post(`${API}/api/inventario`, formData, config);
            setOpenModal(false);
            cargarInventario();
        } catch (error) {
            console.error('Error al registrar', error);
            alert('Error al registrar medicamento');
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111927', mb: 0.5 }}>
                        Farmacia / Botiquín MINSA
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        Control de inventario de medicamentos de entrega gratuita.
                    </Typography>
                </Box>
                <Button onClick={handleOpen} variant="contained" color="primary" startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1.5, fontWeight: 700, boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)' }}>
                    Registrar Ingreso
                </Button>
            </Box>

            <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(34, 41, 47, 0.05)', mb: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111927' }}>Alertas de Abastecimiento</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {inventario.filter(i => i.estado === 'Crítico' || i.estado === 'Bajo').length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No hay alertas de desabastecimiento.</Typography>
                    ) : (
                        inventario.filter(i => i.estado === 'Crítico' || i.estado === 'Bajo').map(item => (
                            <Chip 
                                key={item.id} 
                                label={`${item.nombre} - Quedan ${item.stock}`} 
                                color={getEstadoColor(item.estado)} 
                                variant="outlined" 
                                sx={{ fontWeight: 600, borderRadius: 2 }}
                            />
                        ))
                    )}
                </Box>
            </Card>

            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(34, 41, 47, 0.05)', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <TextField 
                        fullWidth 
                        placeholder="Buscar medicamento..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                            sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                        }}
                        size="small"
                    />
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Medicamento</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Presentación</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Stock Actual</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Stock Mínimo</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtrados.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{row.nombre}</TableCell>
                                    <TableCell sx={{ color: '#475569' }}>{row.tipo}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: row.estado === 'Crítico' ? '#ef4444' : '#10b981' }}>{row.stock}</TableCell>
                                    <TableCell sx={{ color: '#475569' }}>{row.minStock}</TableCell>
                                    <TableCell>
                                        <Chip label={row.estado} size="small" color={getEstadoColor(row.estado)} sx={{ fontWeight: 600, borderRadius: 1 }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtrados.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                                        No se encontraron medicamentos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Card>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Registrar Medicamento</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Nombre del Medicamento" required fullWidth value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                        <TextField label="Presentación (Tabletas, Jarabe, etc.)" required fullWidth value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField type="number" label="Stock Inicial" required fullWidth value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                            <TextField type="number" label="Stock Mínimo (Alerta)" required fullWidth value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                        <Button type="submit" variant="contained">Guardar</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
