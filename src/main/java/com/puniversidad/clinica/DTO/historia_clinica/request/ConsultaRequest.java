package com.puniversidad.clinica.DTO.historia_clinica.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultaRequest {

    @NotNull(message = "El código del paciente es obligatorio")
    private Long codPaciente;

    private Long codCita; // Puede ser nulo si es una consulta libre (sin cita previa)

    @NotBlank(message = "El tipo de consulta es obligatorio")
    @Size(max = 30)
    private String tipoConsulta; // CONTROL | PRIMERA_VEZ | URGENCIA

    @NotBlank(message = "El motivo de la consulta es obligatorio")
    private String motivo;

    private String examenFisico;

    @Size(max = 10, message = "El código CIE-10 no puede superar los 10 caracteres")
    private String diagnosticoCie10;

    @NotBlank(message = "La descripción del diagnóstico es obligatoria")
    @Size(max = 255)
    private String diagnosticoDesc;

    private String evolucion;
    private String indicaciones;

    @Size(max = 100)
    private String derivacion;

    // Listas opcionales para registrar receta y exámenes en la misma consulta
    private List<RecetaItemRequest> medicamentos;
    private List<String> examenesSolicitados;
}