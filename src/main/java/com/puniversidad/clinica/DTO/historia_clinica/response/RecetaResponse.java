package com.puniversidad.clinica.DTO.historia_clinica.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecetaResponse {
    private Long codReceta;
    private String pacienteNombreCompleto;
    private String dniPaciente;
    private LocalDateTime fechaEmision;
    private String estado;
    private String observaciones;
}
