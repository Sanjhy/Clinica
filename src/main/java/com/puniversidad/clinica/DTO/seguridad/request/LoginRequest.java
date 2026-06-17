package com.puniversidad.clinica.DTO.seguridad.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "El DNI es obligatorio")
    private String username; // Mantiene 'username' aquí para recibir el JSON de React limpio

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}