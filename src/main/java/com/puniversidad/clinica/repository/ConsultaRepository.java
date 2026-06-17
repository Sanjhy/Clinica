package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Consulta;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    // Cumple con el índice 'idx_con_paciente' para traer el historial clínico del paciente
    List<Consulta> findByPacienteCodPacienteOrderByFechaConsultaDesc(Long codPaciente);
    
    // Cumple con el índice 'idx_con_medico' para las consultas del médico logueado
    List<Consulta> findByMedicoCodUsuario(Long codMedico);
}