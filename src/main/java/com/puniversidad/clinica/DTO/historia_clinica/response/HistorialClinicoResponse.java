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
public class HistorialClinicoResponse {
    private Long codConsulta;
    private LocalDateTime fechaConsulta;
    private String tipoConsulta;
    private String medicoNombreCompleto; // Para mostrar qué médico lo atendió
    private String motivo;
    private String diagnosticoCie10;
    private String diagnosticoDesc;
    private String estado; // ACTIVA | CERRADA
}