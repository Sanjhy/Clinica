package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Triaje;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TriajeRepository extends JpaRepository<Triaje, Long> {
    // Cumple con el índice 'idx_tri_fecha' para listar los triajes del día (admisión rápida)
    List<Triaje> findByFechaTriajeBetween(LocalDateTime inicio, LocalDateTime fin);

    // Obtener el último triaje de un paciente
    java.util.Optional<Triaje> findFirstByPacienteCodPacienteOrderByFechaTriajeDesc(Long codPaciente);
}