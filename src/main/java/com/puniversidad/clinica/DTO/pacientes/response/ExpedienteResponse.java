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
public class ExpedienteResponse {
    private Long codPaciente;
    private String dni;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private Integer edad;
    private String sexo;
    private String grupoSanguineo;
    private String telefono;
    private String tipoSeguroNombre;
    private String numSeguro;
    private String contactoEmergencia;
    private String telEmergencia;

    // Antecedentes
    private String alergias;
    private String enfCronicas;
    private String medicacionHabitual;
    private String cirugias;

    // Últimos signos vitales (del último triaje)
    private String ultimaPA; // ej: "120/80 mmHg"
    private String ultimaFrecuenciaCardiaca;
    private String ultimaSaturacionO2;
    private String ultimaFechaTriaje;
}
