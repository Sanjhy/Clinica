package com.puniversidad.clinica.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permisos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_permiso")
    private Integer codPermiso;

    @Column(nullable = false, unique = true, length = 80)
    private String codigo;

    @Column(length = 200)
    private String descripcion;

    @Column(nullable = false, length = 50)
    private String modulo;
}