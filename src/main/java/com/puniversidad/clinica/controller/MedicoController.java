package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.model.Cita;
import com.puniversidad.clinica.DTO.pacientes.response.PacienteResponse;
import com.puniversidad.clinica.repository.CitaRepository;
import com.puniversidad.clinica.repository.TriajeRepository;
import com.puniversidad.clinica.service.PacienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medico")
@CrossOrigin(origins = {"http://localhost:5173","http://127.0.0.1:5173"}, allowCredentials = "true")
@PreAuthorize("hasRole('MEDICO')")
public class MedicoController {

    private final PacienteService pacienteService;
    private final TriajeRepository triajeRepository;
    private final CitaRepository citaRepository;
    private final com.puniversidad.clinica.service.ClinicaService clinicaService;
    private final com.puniversidad.clinica.repository.RecetaRepository recetaRepository;

    public MedicoController(PacienteService pacienteService,
                            TriajeRepository triajeRepository,
                            CitaRepository citaRepository,
                            com.puniversidad.clinica.service.ClinicaService clinicaService,
                            com.puniversidad.clinica.repository.RecetaRepository recetaRepository) {
        this.pacienteService = pacienteService;
        this.triajeRepository = triajeRepository;
        this.citaRepository = citaRepository;
        this.clinicaService = clinicaService;
        this.recetaRepository = recetaRepository;
    }

    /** GET /api/medico/recetas — Recetas emitidas por el médico */
    @GetMapping("/recetas")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> misRecetas(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recetaRepository.findByMedicoDniOrderByFechaEmisionDesc(userDetails.getUsername())
                .stream()
                .map(r -> com.puniversidad.clinica.DTO.historia_clinica.response.RecetaResponse.builder()
                        .codReceta(r.getCodReceta())
                        .pacienteNombreCompleto(r.getPaciente().getNombres() + " " + r.getPaciente().getApellidoPaterno())
                        .dniPaciente(r.getPaciente().getDni())
                        .fechaEmision(r.getFechaEmision())
                        .estado(r.getEstado())
                        .observaciones(r.getObservaciones())
                        .build())
                .collect(java.util.stream.Collectors.toList()));
    }

    /** POST /api/medico/consultas — Registrar consulta médica */
    @PostMapping("/consultas")
    public ResponseEntity<?> registrarConsulta(@RequestBody com.puniversidad.clinica.DTO.historia_clinica.request.ConsultaRequest request,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(clinicaService.registrarConsultaCompleta(request, userDetails.getUsername()));
    }

    /** GET /api/medico/consultas/historial/{pacienteId} — Ver historial de un paciente */
    @GetMapping("/consultas/historial/{pacienteId}")
    public ResponseEntity<?> historialPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(clinicaService.obtenerHistorialPaciente(pacienteId));
    }

    /** GET /api/medico/pacientes — Pacientes asignados a este médico */
    @GetMapping("/pacientes")
    public ResponseEntity<List<PacienteResponse>> misPacientes(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pacienteService.listarSegunRol(userDetails.getUsername(), true));
    }

    /** GET /api/medico/triajes/{pacienteId} — Último triaje de un paciente */
    @GetMapping("/triajes/{pacienteId}")
    public ResponseEntity<?> ultimoTriaje(@PathVariable Long pacienteId) {
        return triajeRepository.findFirstByPacienteCodPacienteOrderByFechaTriajeDesc(pacienteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/debug-triajes")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> debugTriajes() {
        List<Map<String, Object>> result = triajeRepository.findAll().stream().map(t -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("codTriaje", t.getCodTriaje());
            map.put("fechaTriaje", t.getFechaTriaje());
            map.put("paSistolica", t.getPaSistolica());
            map.put("paDiastolica", t.getPaDiastolica());
            map.put("frecCardiaca", t.getFrecCardiaca());
            map.put("temperatura", t.getTemperatura());
            map.put("saturacionO2", t.getSaturacionO2());
            map.put("pesoKg", t.getPesoKg());
            map.put("tallaCm", t.getTallaCm());
            
            com.puniversidad.clinica.model.Paciente p = t.getPaciente();
            Map<String, Object> pMap = new java.util.HashMap<>();
            pMap.put("codPaciente", p.getCodPaciente());
            pMap.put("dni", p.getDni());
            pMap.put("nombres", p.getNombres());
            pMap.put("apellidoPaterno", p.getApellidoPaterno());
            pMap.put("sexo", p.getSexo());
            pMap.put("telefono", p.getTelefono());
            pMap.put("nombreCompleto", p.getNombres() + " " + p.getApellidoPaterno());
            
            map.put("paciente", pMap);
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    /** GET /api/medico/citas — Citas del médico */
    @GetMapping("/citas")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<com.puniversidad.clinica.DTO.pacientes.response.CitaResponse>> misCitas(@AuthenticationPrincipal UserDetails userDetails) {
        List<com.puniversidad.clinica.DTO.pacientes.response.CitaResponse> citasDto = citaRepository.findByMedicoDniOrderByFechaHoraAsc(userDetails.getUsername())
                .stream()
                .map(c -> com.puniversidad.clinica.DTO.pacientes.response.CitaResponse.builder()
                        .codCita(c.getCodCita())
                        .codPaciente(c.getPaciente().getCodPaciente())
                        .pacienteNombreCompleto(c.getPaciente().getNombres() + " " + c.getPaciente().getApellidoPaterno())
                        .dniPaciente(c.getPaciente().getDni())
                        .fechaHora(c.getFechaHora())
                        .duracionMin(c.getDuracionMin())
                        .motivo(c.getMotivo())
                        .estado(c.getEstado())
                        .observaciones(c.getObservaciones())
                        .build())
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(citasDto);
    }

    /** PATCH /api/medico/citas/{citaId}/estado — Cambiar estado de la cita */
    @PatchMapping("/citas/{citaId}/estado")
    public ResponseEntity<?> actualizarEstadoCita(@PathVariable Long citaId, @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null) return ResponseEntity.badRequest().body(Map.of("error", "Estado requerido"));

        return citaRepository.findById(citaId).map(cita -> {
            cita.setEstado(nuevoEstado);
            citaRepository.save(cita);
            return ResponseEntity.ok(cita);
        }).orElse(ResponseEntity.notFound().build());
    }
}
