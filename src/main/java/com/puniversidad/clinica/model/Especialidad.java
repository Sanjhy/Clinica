package com.puniversidad.clinica.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "especialidades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_especialidad")
    private Integer codEspecialidad;

    @Column(nullable = false, unique = true, length = 80)
    private String nombre; // Medicina General | Geriatría
}