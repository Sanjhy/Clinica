package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Cita;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    // Cumple con el índice 'idx_cit_fecha' para la agenda del día en administración
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    
    // Listar citas por médico y estado
    List<Cita> findByMedicoCodUsuarioAndEstado(Long codMedico, String estado);

    // Listar citas de un médico (ordenadas por fecha) usando el DNI
    List<Cita> findByMedicoDniOrderByFechaHoraAsc(String dni);
}