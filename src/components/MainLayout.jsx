import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, AppBar, Toolbar, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 260;

export default function MainLayout({ children, menu, title = "CAM Pucallpa", activeView, setActiveView, onLogout }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState({});
    const navigate = useNavigate();

    const handleMobileToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDesktopToggle = () => {
        setDesktopOpen(!desktopOpen);
    };

    const handleLogout = () => {
        if (onLogout) onLogout();
        else {
            sessionStorage.clear();
            navigate('/login');
        }
    };

    const handleMenuClick = (item) => {
        if (item.subitems) {
            setOpenMenus(prev => ({ ...prev, [item.id]: !prev[item.id] }));
        } else {
            setActiveView(item.id);
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', bgcolor: 'sidebar.main', color: 'sidebar.text' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ bgcolor: 'primary.main', p: 0.8, borderRadius: 2, display: 'flex' }}>
                    <LocalHospitalIcon sx={{ color: '#fff' }} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{title}</Typography>
                    <Typography variant="caption" sx={{ color: 'sidebar.text', whiteSpace: 'nowrap' }}>Sistema Hospitalario</Typography>
                </Box>
            </Box>
            
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

            <List sx={{ px: 2, pt: 2 }}>
                {menu.map((item, index) => {
                    if (item.type === 'header') {
                        return (
                            <Typography key={`header-${index}`} variant="overline" sx={{ px: 2, pt: 2, pb: 1, display: 'block', color: 'sidebar.text', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                {item.label}
                            </Typography>
                        );
                    }
                    
                    const isParentActive = item.subitems && item.subitems.some(sub => sub.id === activeView);
                    const isActive = activeView === item.id || isParentActive;
                    const isOpen = openMenus[item.id] || isParentActive;

                    return (
                        <React.Fragment key={item.id || index}>
                            <ListItem disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton 
                                    onClick={() => handleMenuClick(item)}
                                    sx={{ 
                                        borderRadius: 2,
                                        bgcolor: (isActive && !item.subitems) ? 'sidebar.activeBg' : 'transparent',
                                        color: isActive ? 'sidebar.activeText' : 'sidebar.text',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit', fontSize: '1.2rem' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.95rem', whiteSpace: 'nowrap' }} />
                                    {item.subitems ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
                                </ListItemButton>
                            </ListItem>

                            {item.subitems && (
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding sx={{ pl: 2 }}>
                                        {item.subitems.map(subitem => {
                                            const isSubActive = activeView === subitem.id;
                                            return (
                                                <ListItem key={subitem.id} disablePadding sx={{ mb: 0.5 }}>
                                                    <ListItemButton 
                                                        onClick={() => setActiveView(subitem.id)}
                                                        sx={{ 
                                                            borderRadius: 2,
                                                            bgcolor: isSubActive ? 'sidebar.activeBg' : 'transparent',
                                                            color: isSubActive ? 'sidebar.activeText' : 'sidebar.text',
                                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit', fontSize: '1.2rem' }}>
                                                            {subitem.icon}
                                                        </ListItemIcon>
                                                        <ListItemText primary={subitem.label} primaryTypographyProps={{ fontWeight: isSubActive ? 600 : 500, fontSize: '0.9rem', whiteSpace: 'nowrap' }} />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    );
                })}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <List sx={{ px: 2, pb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.light', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}>
                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'nowrap' }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    const actualDrawerWidth = desktopOpen ? drawerWidth : 0;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    width: { sm: `calc(100% - ${actualDrawerWidth}px)` }, 
                    ml: { sm: `${actualDrawerWidth}px` }, 
                    bgcolor: 'background.paper', 
                    color: 'text.primary', 
                    boxShadow: 'none', 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    transition: 'width 0.3s, margin 0.3s'
                }}
            >
                <Toolbar>
                    {/* Botón para móviles */}
                    <IconButton color="inherit" edge="start" onClick={handleMobileToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    {/* Botón para escritorio */}
                    <IconButton color="inherit" edge="start" onClick={handleDesktopToggle} sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
            
            <Box component="nav" sx={{ width: { sm: actualDrawerWidth }, flexShrink: { sm: 0 }, transition: 'width 0.3s' }}>
                <Drawer 
                    variant="temporary" 
                    open={mobileOpen} 
                    onClose={handleMobileToggle} 
                    ModalProps={{ keepMounted: true }} 
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }}
                >
                    {drawer}
                </Drawer>
                <Drawer 
                    variant="persistent" 
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', transition: 'transform 0.3s' } }} 
                    open={desktopOpen}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${actualDrawerWidth}px)` }, mt: 8, transition: 'width 0.3s' }}>
                {children}
            </Box>
        </Box>
    );
}
