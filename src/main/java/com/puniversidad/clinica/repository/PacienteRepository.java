package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Paciente;
import java.util.Optional;
import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    // Buscar paciente por DNI (login o registro rápido)
    Optional<Paciente> findByDni(String dni);

    // Búsqueda parcial por nombres o apellido paterno (para buscador en UI)
    List<Paciente> findByNombresContainingIgnoreCaseOrApellidoPaternoContainingIgnoreCase(String nombres, String apellidoPaterno);

    // Verificar si ya existe un DNI registrado
    boolean existsByDni(String dni);

    // Listar pacientes activos asignados a un médico específico (por DNI del médico)
    List<Paciente> findByMedicoAsignadoDniAndActivoTrue(String dniMedico);

    // Listar pacientes activos asignados a un médico por su cod_usuario
    List<Paciente> findByMedicoAsignadoCodUsuarioAndActivoTrue(Long codMedico);
}
