package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.model.Cita;
import com.puniversidad.clinica.repository.CitaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class DashboardController {

    private final CitaRepository citaRepository;

    public DashboardController(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    @GetMapping("/admin/flujo")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMINISTRATIVO')")
    public ResponseEntity<Map<String, Long>> getFlujoAtencion() {
        List<Cita> citas = citaRepository.findAll();
        
        long enEspera = citas.stream()
            .filter(c -> c.getEstado().equalsIgnoreCase("PROGRAMADA") || 
                         c.getEstado().equalsIgnoreCase("PENDIENTE") || 
                         c.getEstado().equalsIgnoreCase("CONFIRMADA"))
            .count();
            
        long enConsultorio = citas.stream()
            .filter(c -> c.getEstado().equalsIgnoreCase("EN_CONSULTA") || 
                         c.getEstado().equalsIgnoreCase("EN_PROCESO"))
            .count();
            
        long atendidos = citas.stream()
            .filter(c -> c.getEstado().equalsIgnoreCase("FINALIZADA") || 
                         c.getEstado().equalsIgnoreCase("ATENDIDA"))
            .count();
            
        return ResponseEntity.ok(Map.of(
            "enEspera", enEspera,
            "enConsultorio", enConsultorio,
            "atendidos", atendidos
        ));
    }
}
