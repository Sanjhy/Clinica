package com.puniversidad.clinica.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipos_seguro")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoSeguro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_tipo_seguro")
    private Long codTipoSeguro;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre; // SIS | ESSALUD | PARTICULAR | OTRO
}