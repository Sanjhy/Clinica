package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Receta;
import java.util.List;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Long> {
    List<Receta> findByConsultaCodConsulta(Long codConsulta);
    
    // Obtener todas las recetas emitidas por un médico
    List<Receta> findByMedicoDniOrderByFechaEmisionDesc(String dni);
}