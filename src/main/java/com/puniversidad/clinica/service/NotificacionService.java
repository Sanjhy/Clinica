package com.puniversidad.clinica.service;

import com.puniversidad.clinica.model.Notificacion;
import com.puniversidad.clinica.model.entity.Usuario;
import com.puniversidad.clinica.repository.NotificacionRepository;
import com.puniversidad.clinica.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacionService(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Notificacion> obtenerMisNotificaciones(String usernameDni) {
        Usuario usuario = usuarioRepository.findByDni(usernameDni)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return notificacionRepository.findByUsuarioCodUsuarioOrderByFechaDesc(usuario.getCodUsuario());
    }

    @Transactional
    public Notificacion crearNotificacionParaRol(String usernameDniEmisor, String tipoRolDestino, String titulo, String mensaje, String referenciaTipo, Long referenciaId) {
        Usuario emisor = null;
        if (usernameDniEmisor != null) {
            emisor = usuarioRepository.findByDni(usernameDniEmisor).orElse(null);
        }
        
        // Find users with the specified role or all users if GENERAL
        List<Usuario> destinatarios = new java.util.ArrayList<>();
        if ("GENERAL".equalsIgnoreCase(tipoRolDestino)) {
            usuarioRepository.findAll().forEach(u -> {
                if (Boolean.TRUE.equals(u.getActivo())) {
                    destinatarios.add(u);
                }
            });
        } else if ("STAFF_MEDICO".equalsIgnoreCase(tipoRolDestino)) {
            destinatarios.addAll(usuarioRepository.findByRolNombreAndActivoTrue("MEDICO"));
            destinatarios.addAll(usuarioRepository.findByRolNombreAndActivoTrue("ENFERMERA"));
        } else {
            destinatarios.addAll(usuarioRepository.findByRolNombreAndActivoTrue(tipoRolDestino));
        }
        
        // Add sender to destinatarios so they can see the message in their own group history
        final Usuario finalEmisor = emisor;
        if (finalEmisor != null) {
            boolean alreadyInList = destinatarios.stream().anyMatch(u -> u.getCodUsuario().equals(finalEmisor.getCodUsuario()));
            if (!alreadyInList) {
                destinatarios.add(finalEmisor);
            }
        }
        
        Notificacion guardada = null;
        for (Usuario dest : destinatarios) {
            boolean isEmisor = finalEmisor != null && dest.getCodUsuario().equals(finalEmisor.getCodUsuario());
            Notificacion n = Notificacion.builder()
                    .usuario(dest)
                    .emisor(emisor)
                    .tipo(referenciaTipo != null ? referenciaTipo : "SISTEMA")
                    .titulo(titulo)
                    .mensaje(mensaje)
                    .referenciaTipo(referenciaTipo)
                    .referenciaId(referenciaId)
                    .leida(isEmisor) // Mark as read for the sender
                    .fecha(LocalDateTime.now())
                    .build();
            guardada = notificacionRepository.save(n);
        }
        return guardada; // returns the last one, or null if no recipients
    }
    
    @Transactional
    public Notificacion crearNotificacionDirecta(String usernameDniEmisor, Long codUsuarioDestino, String titulo, String mensaje, String referenciaTipo, Long referenciaId) {
        Usuario emisor = null;
        if (usernameDniEmisor != null) {
            emisor = usuarioRepository.findByDni(usernameDniEmisor).orElse(null);
        }
        
        Usuario dest = usuarioRepository.findById(codUsuarioDestino)
                .orElseThrow(() -> new RuntimeException("Usuario destino no encontrado"));
                
        Notificacion n = Notificacion.builder()
                .usuario(dest)
                .emisor(emisor)
                .tipo(referenciaTipo != null ? referenciaTipo : "SISTEMA")
                .titulo(titulo)
                .mensaje(mensaje)
                .referenciaTipo(referenciaTipo)
                .referenciaId(referenciaId)
                .leida(false)
                .fecha(LocalDateTime.now())
                .build();
        return notificacionRepository.save(n);
    }

    @Transactional
    public void marcarComoLeida(Long codNotificacion) {
        notificacionRepository.findById(codNotificacion).ifPresent(n -> {
            n.setLeida(true);
            notificacionRepository.save(n);
        });
    }

    @Transactional(readOnly = true)
    public List<Notificacion> obtenerHistorialChat(String usernameDni, Long otroUsuarioId) {
        Usuario me = usuarioRepository.findByDni(usernameDni).orElseThrow();
        return notificacionRepository.findChatHistory(me.getCodUsuario(), otroUsuarioId);
    }

    @Transactional(readOnly = true)
    public List<Notificacion> obtenerHistorialChatGrupo(String usernameDni, String grupo) {
        Usuario me = usuarioRepository.findByDni(usernameDni).orElseThrow();
        return notificacionRepository.findGroupChatHistory(me.getCodUsuario(), "GRUPO_" + grupo);
    }
}
