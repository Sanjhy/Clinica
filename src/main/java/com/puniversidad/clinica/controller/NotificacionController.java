package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.model.Notificacion;
import com.puniversidad.clinica.service.NotificacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = {"http://localhost:5173","http://127.0.0.1:5173"}, allowCredentials = "true")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    public ResponseEntity<List<Notificacion>> misNotificaciones(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificacionService.obtenerMisNotificaciones(userDetails.getUsername()));
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para enviar notificación a un rol (ej: ADMINISTRADOR)
    @PostMapping("/rol/{rolNombre}")
    public ResponseEntity<?> enviarARol(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String rolNombre, @RequestBody Map<String, Object> body) {
        String titulo = (String) body.get("titulo");
        String mensaje = (String) body.get("mensaje");
        String refTipo = "GRUPO_" + rolNombre;
        Long refId = body.get("referenciaId") != null ? Long.valueOf(body.get("referenciaId").toString()) : null;

        notificacionService.crearNotificacionParaRol(userDetails.getUsername(), rolNombre, titulo, mensaje, refTipo, refId);
        return ResponseEntity.ok(Map.of("mensaje", "Notificación enviada correctamente al grupo"));
    }

    // Endpoint para enviar notificación directa a un usuario
    @PostMapping("/usuario/{codUsuario}")
    public ResponseEntity<?> enviarAUsuario(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long codUsuario, @RequestBody Map<String, Object> body) {
        String titulo = (String) body.get("titulo");
        String mensaje = (String) body.get("mensaje");
        String refTipo = "DM";
        Long refId = body.get("referenciaId") != null ? Long.valueOf(body.get("referenciaId").toString()) : null;

        notificacionService.crearNotificacionDirecta(userDetails.getUsername(), codUsuario, titulo, mensaje, refTipo, refId);
        return ResponseEntity.ok(Map.of("mensaje", "Notificación enviada correctamente al usuario"));
    }

    @GetMapping("/chat/{otroUsuarioId}")
    public ResponseEntity<List<Notificacion>> historialChat(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long otroUsuarioId) {
        return ResponseEntity.ok(notificacionService.obtenerHistorialChat(userDetails.getUsername(), otroUsuarioId));
    }

    @GetMapping("/chat/grupo/{grupoNombre}")
    public ResponseEntity<List<Notificacion>> historialChatGrupo(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String grupoNombre) {
        return ResponseEntity.ok(notificacionService.obtenerHistorialChatGrupo(userDetails.getUsername(), grupoNombre));
    }
}
