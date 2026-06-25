package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.model.entity.Medicamento;
import com.puniversidad.clinica.repository.MedicamentoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class InventarioController {

    private final MedicamentoRepository medicamentoRepository;

    public InventarioController(MedicamentoRepository medicamentoRepository) {
        this.medicamentoRepository = medicamentoRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMINISTRATIVO', 'MEDICO')")
    public ResponseEntity<List<Medicamento>> listarInventario() {
        return ResponseEntity.ok(medicamentoRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMINISTRATIVO')")
    public ResponseEntity<Medicamento> registrarMedicamento(@RequestBody Medicamento medicamento) {
        calcularEstado(medicamento);
        return ResponseEntity.ok(medicamentoRepository.save(medicamento));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMINISTRATIVO')")
    public ResponseEntity<Medicamento> actualizarStock(@PathVariable Long id, @RequestBody Medicamento medicamento) {
        Medicamento med = medicamentoRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        med.setStock(medicamento.getStock());
        med.setMinStock(medicamento.getMinStock());
        med.setNombre(medicamento.getNombre());
        med.setTipo(medicamento.getTipo());
        calcularEstado(med);
        return ResponseEntity.ok(medicamentoRepository.save(med));
    }

    private void calcularEstado(Medicamento med) {
        if (med.getStock() <= med.getMinStock() * 0.5) {
            med.setEstado("Crítico");
        } else if (med.getStock() <= med.getMinStock()) {
            med.setEstado("Bajo");
        } else {
            med.setEstado("Óptimo");
        }
    }
}
