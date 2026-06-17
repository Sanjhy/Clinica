package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Antecedente;
import java.util.Optional;

@Repository
public interface AntecedenteRepository extends JpaRepository<Antecedente, Long> {
    // Al ser una relación 1:1, buscamos los antecedentes directamente por el ID del paciente
    Optional<Antecedente> findByPacienteCodPaciente(Long codPaciente);
}