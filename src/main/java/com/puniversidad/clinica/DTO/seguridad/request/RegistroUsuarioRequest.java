package com.puniversidad.clinica.DTO.seguridad.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class RegistroUsuarioRequest {
    
    @NotBlank(message = "El DNI es obligatorio.")
    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe contener exactamente 8 dígitos.")
    private String dni;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.-])[A-Za-z\\d@$!%*?&.-]+$", message = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.")
    private String password;

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres.")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s\\'\\-]+$", message = "El nombre contiene caracteres no permitidos.")
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios.")
    @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres.")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s\\'\\-]+$", message = "Los apellidos contienen caracteres inválidos.")
    private String apellidos;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "Ingrese un correo electrónico válido.")
    @Size(max = 150)
    private String email;

    @Size(max = 20)
    private String colegiatura;

    @NotBlank(message = "El número telefónico es obligatorio.")
    @Pattern(regexp = "^[0-9]{9}$", message = "El teléfono debe contener 9 dígitos y solo números.")
    private String telefono;

    @Size(max = 100)
    private String especialidad;

    @NotBlank(message = "Existen campos obligatorios sin completar.")
    private String rolNombre; // Ej: MEDICO, ENFERMERA, ADMINISTRADOR, ADMINISTRATIVO
}
