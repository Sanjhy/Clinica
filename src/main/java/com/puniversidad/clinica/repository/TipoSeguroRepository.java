package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.TipoSeguro;
import java.util.Optional;

@Repository
public interface TipoSeguroRepository extends JpaRepository<TipoSeguro, Long> {
    Optional<TipoSeguro> findByNombre(String nombre); // Buscar por SIS, ESSALUD, etc.
}