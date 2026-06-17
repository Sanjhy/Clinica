package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.entity.Rol;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    // Buscar rol por nombre (ADMIN, MEDICO, ENFERMERA, etc.)
    Optional<Rol> findByNombre(String nombre);
}
