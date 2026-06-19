package com.puniversidad.clinica.DTO.pacientes.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacienteResponse {
    private Long codPaciente;
    private String dni;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String grupoSanguineo;
    private String telefono;
    private String tipoSeguroNombre;
    private String numSeguro;
    private Boolean activo;
    private String medicoAsignadoNombre; // Nombre del médico asignado por la enfermera
    private Long codMedicoAsignado;      // ID del médico para filtrar
}