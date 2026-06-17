package com.puniversidad.clinica.DTO.pacientes.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteRequest {

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{8}$", message = "El DNI debe tener exactamente 8 dígitos numéricos")
    private String dni;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombres;

    @NotBlank(message = "El apellido paterno es obligatorio")
    @Size(max = 80, message = "El apellido paterno no puede exceder los 80 caracteres")
    private String apellidoPaterno;

    @Size(max = 80, message = "El apellido materno no puede exceder los 80 caracteres")
    private String apellidoMaterno;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El sexo es obligatorio")
    @Pattern(regexp = "^[MF]$", message = "El sexo debe ser 'M' o 'F'")
    private String sexo;

    @Size(max = 5, message = "El grupo sanguíneo no puede exceder los 5 caracteres")
    private String grupoSanguineo;

    @Size(max = 15, message = "El teléfono no puede exceder los 15 caracteres")
    private String telefono;

    @Size(max = 200, message = "La dirección no puede exceder los 200 caracteres")
    private String direccion;

    @Size(max = 80, message = "El distrito no puede exceder los 80 caracteres")
    private String distrito;

    @NotNull(message = "El tipo de seguro es obligatorio")
    private Long codTipoSeguro;

    @Size(max = 30, message = "El número de seguro no puede exceder los 30 caracteres")
    private String numSeguro;

    @Size(max = 100, message = "El contacto de emergencia no puede exceder los 100 caracteres")
    private String contactoEmergencia;

    @Size(max = 15, message = "El teléfono de emergencia no puede exceder los 15 caracteres")
    private String telEmergencia;
}