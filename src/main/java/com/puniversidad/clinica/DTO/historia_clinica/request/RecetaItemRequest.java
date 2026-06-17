package com.puniversidad.clinica.DTO.historia_clinica.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecetaItemRequest {

    @NotBlank(message = "El nombre del medicamento es obligatorio")
    @Size(max = 150)
    private String medicamento;

    @Size(max = 50)
    private String concentracion;

    @Size(max = 30)
    private String via;

    @NotBlank(message = "La dosis es obligatoria")
    @Size(max = 80)
    private String dosis;

    @NotBlank(message = "La duración es obligatoria")
    @Size(max = 50)
    private String duracion;

    @Size(max = 255)
    private String instrucciones;
}