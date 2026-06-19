package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.DTO.pacientes.request.PacienteRequest;
import com.puniversidad.clinica.DTO.pacientes.response.PacienteResponse;
import com.puniversidad.clinica.DTO.pacientes.response.ExpedienteResponse;
import com.puniversidad.clinica.model.Paciente;
import com.puniversidad.clinica.model.entity.Usuario;
import com.puniversidad.clinica.repository.PacienteRepository;
import com.puniversidad.clinica.repository.UsuarioRepository;
import com.puniversidad.clinica.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = {"http://localhost:5173","http://127.0.0.1:5173"}, allowCredentials = "true")
public class PacienteController {

    private final PacienteService pacienteService;
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    public PacienteController(PacienteService pacienteService,
                               PacienteRepository pacienteRepository,
                               UsuarioRepository usuarioRepository) {
        this.pacienteService = pacienteService;
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * POST /api/pacientes — Registra un nuevo paciente. Solo ADMINISTRATIVO.
     * NOTA: hasRole('X') equivale a hasAuthority('ROLE_X') automáticamente.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATIVO')")
    public ResponseEntity<PacienteResponse> registrar(@Valid @RequestBody PacienteRequest request,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        PacienteResponse response = pacienteService.registrarPaciente(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/pacientes
     * Si el usuario es MEDICO → devuelve SOLO sus pacientes asignados.
     * Si es ADMINISTRATIVO o ENFERMERA → devuelve todos los activos.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATIVO', 'MEDICO', 'ENFERMERA')")
    public ResponseEntity<List<PacienteResponse>> listarActivos(@AuthenticationPrincipal UserDetails userDetails) {
        String dniLogueado = userDetails.getUsername();
        boolean esMedico = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MEDICO"));
        return ResponseEntity.ok(pacienteService.listarSegunRol(dniLogueado, esMedico));
    }

    /**
     * GET /api/pacientes/dni/{dni} — Búsqueda por DNI para Admisión o Triaje.
     */
    @GetMapping("/dni/{dni}")
    @PreAuthorize("hasAnyRole('ADMINISTRATIVO', 'MEDICO', 'ENFERMERA')")
    public ResponseEntity<PacienteResponse> buscarPorDni(@PathVariable String dni) {
        return ResponseEntity.ok(pacienteService.buscarPorDni(dni));
    }

    /**
     * PUT /api/pacientes/{id} — Actualiza datos del paciente. Solo ADMINISTRATIVO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATIVO')")
    public ResponseEntity<PacienteResponse> actualizar(@PathVariable("id") Long codPaciente,
                                                       @Valid @RequestBody PacienteRequest request) {
        return ResponseEntity.ok(pacienteService.actualizarPaciente(codPaciente, request));
    }

    /**
     * PATCH /api/pacientes/{id}/baja — Baja lógica. Solo ADMINISTRATIVO.
     */
    @PatchMapping("/{id}/baja")
    @PreAuthorize("hasRole('ADMINISTRATIVO')")
    public ResponseEntity<Void> darDeBaja(@PathVariable("id") Long codPaciente) {
        pacienteService.darDeBajaLogica(codPaciente);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/pacientes/{id}/expediente — Expediente completo del paciente.
     */
    @GetMapping("/{id}/expediente")
    @PreAuthorize("hasAnyRole('MEDICO', 'ENFERMERA')")
    public ResponseEntity<ExpedienteResponse> obtenerExpediente(@PathVariable("id") Long codPaciente) {
        return ResponseEntity.ok(pacienteService.obtenerExpediente(codPaciente));
    }

    /**
     * PATCH /api/pacientes/{id}/medico
     * Asigna un médico a un paciente. Accesible por ENFERMERA.
     * Body: { "codMedico": 2 }
     */
    @PatchMapping("/{id}/medico")
    @PreAuthorize("hasAnyRole('ENFERMERA', 'ADMINISTRATIVO')")
    public ResponseEntity<Map<String, String>> asignarMedico(
            @PathVariable("id") Long codPaciente,
            @RequestBody Map<String, Long> body) {

        Long codMedico = body.get("codMedico");
        if (codMedico == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Se requiere codMedico"));
        }

        Paciente paciente = pacienteRepository.findById(codPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado: " + codPaciente));

        Usuario medico = usuarioRepository.findById(codMedico)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado: " + codMedico));

        paciente.setMedicoAsignado(medico);
        pacienteRepository.save(paciente);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Médico asignado correctamente.",
                "medico", medico.getNombre() + " " + medico.getApellidos()
        ));
    }
}