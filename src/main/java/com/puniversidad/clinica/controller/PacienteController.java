package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.DTO.pacientes.request.PacienteRequest;
import com.puniversidad.clinica.DTO.pacientes.response.PacienteResponse;
import com.puniversidad.clinica.DTO.pacientes.response.ExpedienteResponse;
import com.puniversidad.clinica.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    /**
     * POST /api/pacientes
     * Registra un nuevo adulto mayor. Permitido para ADMINISTRATIVO.
     * @AuthenticationPrincipal extrae automáticamente el usuario autenticado desde el JWT.
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMINISTRATIVO')")
    public ResponseEntity<PacienteResponse> registrar(@Valid @RequestBody PacienteRequest request,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        PacienteResponse response = pacienteService.registrarPaciente(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/pacientes
     * Lista todos los pacientes con estado activo. Permitido para Administrativos, Médicos y Enfermeras.
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATIVO', 'MEDICO', 'ENFERMERA')")
    public ResponseEntity<List<PacienteResponse>> listarActivos() {
        return ResponseEntity.ok(pacienteService.listarPacientesActivos());
    }

    /**
     * GET /api/pacientes/dni/{dni}
     * Búsqueda rápida de pacientes por DNI para Admisión o Triaje.
     */
    @GetMapping("/dni/{dni}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATIVO', 'MEDICO', 'ENFERMERA')")
    public ResponseEntity<PacienteResponse> buscarPorDni(@PathVariable String dni) {
        return ResponseEntity.ok(pacienteService.buscarPorDni(dni));
    }

    /**
     * PUT /api/pacientes/{id}
     * Actualiza los datos de un paciente sin alterar auditorías ni IDs. Permitido para ADMINISTRATIVO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRATIVO')")
    public ResponseEntity<PacienteResponse> actualizar(@PathVariable("id") Long codPaciente,
                                                       @Valid @RequestBody PacienteRequest request) {
        return ResponseEntity.ok(pacienteService.actualizarPaciente(codPaciente, request));
    }

    /**
     * PATCH /api/pacientes/{id}/baja
     * Aplica la baja lógica (activo = false). Ningún registro médico se borra físicamente.
     */
    @PatchMapping("/{id}/baja")
    @PreAuthorize("hasAuthority('ADMINISTRATIVO')")
    public ResponseEntity<Void> darDeBaja(@PathVariable("id") Long codPaciente) {
        pacienteService.darDeBajaLogica(codPaciente);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/pacientes/{id}/expediente
     * Obtiene todos los datos del paciente (filiación, antecedentes, y último triaje)
     */
    @GetMapping("/{id}/expediente")
    @PreAuthorize("hasAnyAuthority('MEDICO', 'ENFERMERA')")
    public ResponseEntity<ExpedienteResponse> obtenerExpediente(@PathVariable("id") Long codPaciente) {
        return ResponseEntity.ok(pacienteService.obtenerExpediente(codPaciente));
    }
}