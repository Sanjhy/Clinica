package com.puniversidad.clinica.DTO.seguridad.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilResponse {
    private Long codUsuario;
    private String dni;
    private String nombre;
    private String apellidos;
    private String nombreCompleto;
    private String email;
    private String colegiatura;
    private String telefono;
    private String rolNombre;
}
