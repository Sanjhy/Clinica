package com.puniversidad.clinica.DTO.pacientes.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitaResponse {
    private Long codCita;
    private Long codPaciente;
    private String pacienteNombreCompleto;
    private String dniPaciente;
    private LocalDateTime fechaHora;
    private Integer duracionMin;
    private String motivo;
    private String estado;
    private String observaciones;
}
