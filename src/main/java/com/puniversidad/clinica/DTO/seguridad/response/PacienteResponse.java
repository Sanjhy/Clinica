package com.puniversidad.clinica.DTO.seguridad.response;

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
    private String nombreCompleto; // Concatenación de nombres y apellidos en el Service
    private LocalDate fechaNacimiento;
    private String sexo;
    private String grupoSanguineo;
    private String telefono;
    private String tipoSeguroNombre; // Solo el nombre del seguro (ej: "SIS") en vez de toda la entidad
    private String numSeguro;
    private Boolean activo;
}