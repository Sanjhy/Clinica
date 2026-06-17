package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.ExamenSolicitado;
import java.util.List;

@Repository
public interface ExamenSolicitadoRepository extends JpaRepository<ExamenSolicitado, Long> {
    // Obtener todos los exámenes de una consulta
    List<ExamenSolicitado> findByConsultaCodConsulta(Long codConsulta);

    // Obtener exámenes pendientes de un paciente
    List<ExamenSolicitado> findByPacienteCodPacienteAndEstado(Long codPaciente, String estado);
}
