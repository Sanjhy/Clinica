package com.puniversidad.clinica.DTO.seguridad.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PerfilUpdateRequest {
    @Size(max = 100)
    private String nombre;

    @Size(max = 100)
    private String apellidos;

    @Size(max = 150)
    private String email;

    @Size(max = 20)
    private String colegiatura;

    @Size(max = 15)
    private String telefono;

    @Size(max = 100)
    private String especialidad;
}
