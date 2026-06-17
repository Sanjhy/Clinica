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
    private String nombreCompleto; // Concatenación de nombres y apellidos
    private LocalDate fechaNacimiento;
    private String sexo;
    private String grupoSanguineo;
    private String telefono;
    private String tipoSeguroNombre; // Solo el nombre del seguro (ej: SIS, ESSALUD)
    private String numSeguro;
    private Boolean activo; // Estado de baja lógica
}