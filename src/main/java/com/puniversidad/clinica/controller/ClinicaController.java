package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.DTO.historia_clinica.request.ConsultaRequest;
import com.puniversidad.clinica.DTO.historia_clinica.response.HistorialClinicoResponse;
import com.puniversidad.clinica.model.Cita;
import com.puniversidad.clinica.model.Triaje;
import com.puniversidad.clinica.service.ClinicaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clinica")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ClinicaController {

    private final ClinicaService clinicaService;

    public ClinicaController(ClinicaService clinicaService) {
        this.clinicaService = clinicaService;
    }

    /**
     * POST /api/clinica/citas
     * Programa una cita médica para el adulto mayor. Permitido para ADMINISTRATIVO.
     */
    @PostMapping("/citas")
    @PreAuthorize("hasAuthority('ADMINISTRATIVO')")
    public ResponseEntity<Cita> programarCita(@RequestBody Map<String, Object> body) {
        Cita cita = clinicaService.programarCita(
                Long.valueOf(body.get("codPaciente").toString()),
                Long.valueOf(body.get("codMedico").toString()),
                Integer.valueOf(body.get("codEspecialidad").toString()),
                Long.valueOf(body.get("codAdministrativo").toString()),
                LocalDateTime.parse(body.get("fechaHora").toString()),
                body.get("motivo").toString()
        );
        return new ResponseEntity<>(cita, HttpStatus.CREATED);
    }

    /**
     * POST /api/clinica/triajes
     * Registra los signos vitales del paciente. Permitido exclusivamente para ENFERMERA.
     */
    @PostMapping("/triajes")
    @PreAuthorize("hasAuthority('ENFERMERA')")
    public ResponseEntity<Triaje> registrarTriaje(@Valid @RequestBody Triaje triaje,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        return new ResponseEntity<>(
                clinicaService.registrarTriaje(triaje, userDetails.getUsername()),
                HttpStatus.CREATED
        );
    }

    /**
     * POST /api/clinica/consultas
     * Registra la atención médica completa (Diagnóstico CIE-10, Evolución y Recetas). Exclusivo para MEDICO.
     */
    @PostMapping("/consultas")
    @PreAuthorize("hasAuthority('MEDICO')")
    public ResponseEntity<HistorialClinicoResponse> registrarConsulta(
            @Valid @RequestBody ConsultaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return new ResponseEntity<>(
                clinicaService.registrarConsultaCompleta(request, userDetails.getUsername()),
                HttpStatus.CREATED
        );
    }

    /**
     * GET /api/clinica/historial/paciente/{pacienteId}
     * Recupera la historia clínica completa de un paciente ordenado cronológicamente.
     */
    @GetMapping("/historial/paciente/{pacienteId}")
    @PreAuthorize("hasAnyAuthority('MEDICO', 'ENFERMERA')")
    public ResponseEntity<List<HistorialClinicoResponse>> obtenerHistorial(
            @PathVariable("pacienteId") Long codPaciente) {
        return ResponseEntity.ok(clinicaService.obtenerHistorialPaciente(codPaciente));
    }
}