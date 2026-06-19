package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.DTO.seguridad.request.CambiarPasswordRequest;
import com.puniversidad.clinica.DTO.seguridad.request.PerfilUpdateRequest;
import com.puniversidad.clinica.DTO.seguridad.response.PerfilResponse;
import com.puniversidad.clinica.model.entity.Usuario;
import com.puniversidad.clinica.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * GET /api/usuarios/perfil
     * Retorna los datos completos del usuario autenticado (desde el JWT).
     */
    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario u = usuarioRepository.findByDni(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(PerfilResponse.builder()
                .codUsuario(u.getCodUsuario())
                .dni(u.getDni())
                .nombre(u.getNombre())
                .apellidos(u.getApellidos())
                .nombreCompleto(u.getNombre() + " " + u.getApellidos())
                .email(u.getEmail())
                .colegiatura(u.getColegiatura())
                .telefono(u.getTelefono())
                .rolNombre(u.getRol() != null ? u.getRol().getNombre() : "")
                .build());
    }

    /**
     * PUT /api/usuarios/perfil
     * Actualiza nombre, apellidos, email, colegiatura y teléfono del médico autenticado.
     */
    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> actualizarPerfil(
            @Valid @RequestBody PerfilUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario u = usuarioRepository.findByDni(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getNombre() != null && !request.getNombre().isBlank())
            u.setNombre(request.getNombre());
        if (request.getApellidos() != null && !request.getApellidos().isBlank())
            u.setApellidos(request.getApellidos());
        if (request.getEmail() != null)
            u.setEmail(request.getEmail());
        if (request.getColegiatura() != null)
            u.setColegiatura(request.getColegiatura());
        if (request.getTelefono() != null)
            u.setTelefono(request.getTelefono());

        usuarioRepository.save(u);

        return ResponseEntity.ok(PerfilResponse.builder()
                .codUsuario(u.getCodUsuario())
                .dni(u.getDni())
                .nombre(u.getNombre())
                .apellidos(u.getApellidos())
                .nombreCompleto(u.getNombre() + " " + u.getApellidos())
                .email(u.getEmail())
                .colegiatura(u.getColegiatura())
                .telefono(u.getTelefono())
                .rolNombre(u.getRol() != null ? u.getRol().getNombre() : "")
                .build());
    }

    /**
     * PUT /api/usuarios/perfil/password
     * Cambia la contraseña del usuario autenticado.
     * Verifica la contraseña actual antes de actualizar.
     */
    @PutMapping("/perfil/password")
    public ResponseEntity<Map<String, String>> cambiarPassword(
            @Valid @RequestBody CambiarPasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario u = usuarioRepository.findByDni(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(request.getPasswordActual(), u.getPasswordHash())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La contraseña actual es incorrecta."));
        }

        // Encriptar y guardar la nueva contraseña
        u.setPasswordHash(passwordEncoder.encode(request.getPasswordNueva()));
        usuarioRepository.save(u);

        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente."));
    }

    /**
     * GET /api/usuarios/medicos
     * Retorna la lista de médicos activos para que la enfermera pueda asignar uno.
     * Accesible por ENFERMERA y ADMINISTRATIVO.
     */
    @GetMapping("/medicos")
    @PreAuthorize("hasAnyRole('ENFERMERA', 'ADMINISTRATIVO', 'MEDICO')")
    public ResponseEntity<List<PerfilResponse>> listarMedicosActivos() {
        List<PerfilResponse> medicos = usuarioRepository
                .findByRolNombreAndActivoTrue("MEDICO")
                .stream()
                .map(u -> PerfilResponse.builder()
                        .codUsuario(u.getCodUsuario())
                        .dni(u.getDni())
                        .nombre(u.getNombre())
                        .apellidos(u.getApellidos())
                        .nombreCompleto(u.getNombre() + " " + u.getApellidos())
                        .colegiatura(u.getColegiatura())
                        .rolNombre("MEDICO")
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(medicos);
    }
}
