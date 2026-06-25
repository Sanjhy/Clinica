import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, Chip 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const API = 'http://localhost:8080';

export default function GestionPersonal({ user }) {
    const [personal, setPersonal] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    
    const [formData, setFormData] = useState({
        codUsuario: null, dni: '', password: '', confirmPassword: '', nombre: '', apellidos: '', email: '', 
        telefono: '', colegiatura: '', especialidad: '', rolNombre: 'MEDICO'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('');

    const cargarPersonal = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            const res = await axios.get(`${API}/api/usuarios/todos`, config);
            setPersonal(res.data);
        } catch (error) {
            console.error('Error cargando personal', error);
        }
    };

    useEffect(() => {
        if (user?.accessToken) cargarPersonal();
    }, [user]);

    const handleOpen = () => {
        setIsEditing(false);
        setFormData({
            codUsuario: null, dni: '', password: '', confirmPassword: '', nombre: '', apellidos: '', email: '', 
            telefono: '', colegiatura: '', especialidad: '', rolNombre: 'MEDICO'
        });
        setOpenModal(true);
    };

    const handleEdit = (p) => {
        setIsEditing(true);
        setFormData({
            codUsuario: p.codUsuario,
            dni: p.dni,
            password: '', 
            confirmPassword: '',
            nombre: p.nombre,
            apellidos: p.apellidos,
            email: p.email || '',
            telefono: p.telefono || '',
            colegiatura: p.colegiatura || '',
            especialidad: p.especialidad || '',
            rolNombre: p.rolNombre
        });
        setOpenModal(true);
    };

    const handleSuspend = async (codUsuario, estadoActual) => {
        if (!window.confirm(`¿Está seguro de ${estadoActual ? 'suspender' : 'reactivar'} a este trabajador?`)) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            await axios.put(`${API}/api/usuarios/${codUsuario}/estado`, {}, config);
            cargarPersonal();
        } catch (error) {
            console.error('Error cambiando estado', error);
            alert('Error al actualizar estado.');
        }
    };

    const validarCampo = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "nombre":
                if (!value.trim()) errorMsg = "El nombre es obligatorio.";
                else if (value.length < 2 || value.length > 50) errorMsg = "El nombre debe tener entre 2 y 50 caracteres.";
                else if (/\d/.test(value)) errorMsg = "No se permiten números en el nombre.";
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\'-]+$/.test(value)) errorMsg = "El nombre contiene caracteres no permitidos.";
                break;
            case "apellidos":
                if (!value.trim()) errorMsg = "Los apellidos son obligatorios.";
                else if (/\d/.test(value)) errorMsg = "No se permiten números en los apellidos.";
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\'-]+$/.test(value)) errorMsg = "Los apellidos contienen caracteres inválidos.";
                break;
            case "dni":
                if (!value.trim()) errorMsg = "El DNI es obligatorio.";
                else if (!/^\d{8}$/.test(value)) errorMsg = "El DNI debe contener exactamente 8 dígitos.";
                break;
            case "telefono":
                if (!value.trim()) errorMsg = "El número telefónico es obligatorio.";
                else if (!/^\d{9}$/.test(value)) errorMsg = "El teléfono debe contener 9 dígitos.";
                break;
            case "email":
                if (!value.trim()) errorMsg = "El correo electrónico es obligatorio.";
                else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "Ingrese un correo electrónico válido.";
                break;
            case "password":
                if (!isEditing && !value) errorMsg = "La contraseña es obligatoria.";
                else if (value) {
                    if (value.length < 8) errorMsg = "La contraseña debe tener al menos 8 caracteres.";
                    else if (!/[A-Z]/.test(value)) errorMsg = "La contraseña debe contener al menos una mayúscula.";
                    else if (!/[a-z]/.test(value)) errorMsg = "La contraseña debe contener al menos una minúscula.";
                    else if (!/\d/.test(value)) errorMsg = "La contraseña debe contener al menos un número.";
                    else if (!/[@$!%*?&.-]/.test(value)) errorMsg = "La contraseña debe contener al menos un carácter especial.";
                }
                break;
            case "confirmPassword":
                if (value !== formData.password) errorMsg = "Las contraseñas no coinciden.";
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let val = value;
        
        if (name === 'dni' || name === 'telefono') {
            val = value.replace(/[^0-9]/g, '');
            if (name === 'dni' && val.length > 8) return;
            if (name === 'telefono' && val.length > 9) return;
        }

        setFormData(prev => ({ ...prev, [name]: val }));
        validarCampo(name, val);

        if (name === 'password') {
            if (val.length > 0 && val.length < 8) setPasswordStrength("La contraseña es débil.");
            else if (val.length >= 8 && /[A-Z]/.test(val) && /\d/.test(val) && !/[@$!%*?&.-]/.test(val)) setPasswordStrength("La contraseña es moderada.");
            else if (val.length >= 8 && /[A-Z]/.test(val) && /\d/.test(val) && /[@$!%*?&.-]/.test(val)) setPasswordStrength("La contraseña es segura.");
            else setPasswordStrength("");
            
            if (formData.confirmPassword) {
                validarCampo('confirmPassword', formData.confirmPassword);
            }
        }
    };

    const getFieldStyle = (name, value, errorMsg) => {
        if (errorMsg) return {}; 
        if (!value) return {}; 
        
        let color = '#22c55e'; // Verde (Éxito)
        if (name === 'password') {
            if (passwordStrength === 'La contraseña es moderada.') color = '#3b82f6'; // Azul (Intermedio)
            else if (passwordStrength !== 'La contraseña es segura.') return {};
        }

        return {
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: color, borderWidth: '2px' },
                '&:hover fieldset': { borderColor: color },
                '&.Mui-focused fieldset': { borderColor: color },
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const campos = ['dni', 'nombre', 'apellidos', 'email', 'telefono', 'password', 'confirmPassword'];
        let hasErrors = false;
        campos.forEach(campo => {
            if (!validarCampo(campo, formData[campo])) hasErrors = true;
        });

        if (hasErrors) {
            alert("Existen campos obligatorios sin completar. Revise los datos ingresados.");
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            // Copiamos el formData y quitamos confirmPassword para no enviarlo al backend
            const payload = { ...formData };
            delete payload.confirmPassword;

            if (isEditing) {
                await axios.put(`${API}/api/usuarios/${payload.codUsuario}`, payload, config);
                alert('Personal actualizado exitosamente');
            } else {
                await axios.post(`${API}/api/usuarios/registro`, payload, config);
                alert('Personal registrado exitosamente');
            }
            setOpenModal(false);
            cargarPersonal();
        } catch (error) {
            console.error('Error al guardar personal', error);
            alert(error.response?.data?.message || 'Error al guardar el personal.');
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    Gestión de Personal
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<PersonAddIcon />} 
                    onClick={handleOpen}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
                >
                    Registrar Nuevo Trabajador
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>DNI</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Nombre Completo</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Rol</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Especialidad / CMP</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Contacto</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569', align: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {personal.map((p) => {
                            // Enmascaramiento de DNI y teléfono para la vista pública
                            const dniMask = p.dni ? `****${p.dni.slice(-4)}` : 'N/A';
                            const telfMask = p.telefono ? `*****${p.telefono.slice(-4)}` : '-';
                            return (
                                <TableRow key={p.codUsuario} hover>
                                    <TableCell>{dniMask}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{p.nombreCompleto}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={p.rolNombre} 
                                            size="small" 
                                            sx={{ 
                                                fontWeight: 700, 
                                                bgcolor: p.rolNombre === 'MEDICO' ? '#dbeafe' : (p.rolNombre === 'ENFERMERA' ? '#dcfce7' : '#f1f5f9'),
                                                color: p.rolNombre === 'MEDICO' ? '#1e40af' : (p.rolNombre === 'ENFERMERA' ? '#166534' : '#475569')
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {p.rolNombre === 'MEDICO' ? (
                                            <>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.especialidad || 'General'}</Typography>
                                                <Typography variant="caption" color="text.secondary">CMP: {p.colegiatura || 'N/A'}</Typography>
                                            </>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{telfMask}</Typography>
                                        <Typography variant="caption" color="text.secondary">{p.email || '-'}</Typography>
                                        {!p.activo && <Chip label="Suspendido" size="small" color="error" sx={{ mt: 1, display: 'block', width: 'fit-content' }} />}
                                    </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button size="small" variant="outlined" color="primary" onClick={() => handleEdit(p)}>
                                            Editar
                                        </Button>
                                        <Button size="small" variant="outlined" color={p.activo ? "error" : "success"} onClick={() => handleSuspend(p.codUsuario, p.activo)}>
                                            {p.activo ? 'Suspender' : 'Reactivar'}
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de Registro / Edición */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {isEditing ? 'Editar Personal' : 'Registrar Nuevo Personal'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="DNI" name="dni" required value={formData.dni} onChange={handleChange} fullWidth disabled={isEditing} error={!!errors.dni} helperText={errors.dni} sx={getFieldStyle('dni', formData.dni, errors.dni)} />
                            <TextField label={isEditing ? "Contraseña (No modificable)" : "Contraseña"} name="password" type="password" required={!isEditing} disabled={isEditing} value={formData.password} onChange={handleChange} fullWidth error={!!errors.password} helperText={isEditing ? "Dato sensible protegido." : errors.password || passwordStrength} FormHelperTextProps={{ sx: { color: isEditing ? 'text.secondary' : passwordStrength === 'La contraseña es segura.' ? 'success.main' : passwordStrength === 'La contraseña es moderada.' ? 'info.main' : 'error.main' } }} sx={getFieldStyle('password', formData.password, errors.password)} />
                            <TextField label={isEditing ? "Confirmar (No modificable)" : "Confirmar Contraseña"} name="confirmPassword" type="password" required={!isEditing} disabled={isEditing} value={formData.confirmPassword} onChange={handleChange} fullWidth error={!!errors.confirmPassword} helperText={isEditing ? "" : errors.confirmPassword || (formData.confirmPassword && !errors.confirmPassword ? "Las contraseñas coinciden." : "")} FormHelperTextProps={{ sx: { color: formData.confirmPassword && !errors.confirmPassword ? 'success.main' : 'error.main' } }} sx={getFieldStyle('confirmPassword', formData.confirmPassword, errors.confirmPassword)} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="Nombre" name="nombre" required value={formData.nombre} onChange={handleChange} fullWidth error={!!errors.nombre} helperText={errors.nombre} sx={getFieldStyle('nombre', formData.nombre, errors.nombre)} />
                            <TextField label="Apellidos" name="apellidos" required value={formData.apellidos} onChange={handleChange} fullWidth error={!!errors.apellidos} helperText={errors.apellidos} sx={getFieldStyle('apellidos', formData.apellidos, errors.apellidos)} />
                        </Box>

                        <TextField select label="Rol en el Sistema" name="rolNombre" value={formData.rolNombre} onChange={handleChange} fullWidth required disabled={isEditing} sx={getFieldStyle('rolNombre', formData.rolNombre, errors.rolNombre)}>
                            <MenuItem value="MEDICO">Médico</MenuItem>
                            <MenuItem value="ENFERMERA">Enfermera</MenuItem>
                            <MenuItem value="ADMINISTRATIVO">Administrativo</MenuItem>
                            <MenuItem value="ADMINISTRADOR">Administrador de TI</MenuItem>
                        </TextField>

                        {formData.rolNombre === 'MEDICO' && (
                            <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
                                <TextField label="Especialidad" name="especialidad" placeholder="Ej: Cardiología" value={formData.especialidad} onChange={handleChange} fullWidth sx={getFieldStyle('especialidad', formData.especialidad, null)} />
                                <TextField label="N° Colegiatura (CMP)" name="colegiatura" value={formData.colegiatura} onChange={handleChange} fullWidth sx={getFieldStyle('colegiatura', formData.colegiatura, null)} />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="Teléfono" name="telefono" required value={formData.telefono} onChange={handleChange} fullWidth error={!!errors.telefono} helperText={errors.telefono} sx={getFieldStyle('telefono', formData.telefono, errors.telefono)} />
                            <TextField label="Correo Electrónico" name="email" type="email" required value={formData.email} onChange={handleChange} fullWidth placeholder="ejemplo@gmail.com" error={!!errors.email} helperText={errors.email} sx={getFieldStyle('email', formData.email, errors.email)} />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenModal(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 600, borderRadius: 2 }}>
                            {isEditing ? 'Guardar Cambios' : 'Registrar'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
