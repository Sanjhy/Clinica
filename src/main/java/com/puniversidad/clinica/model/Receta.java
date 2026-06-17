package com.puniversidad.clinica.model;

import com.puniversidad.clinica.model.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recetas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_receta")
    private Long codReceta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_consulta", nullable = false)
    private Consulta consulta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_medico", nullable = false)
    private Usuario medico;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "EMITIDA";

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_emision")
    @Builder.Default
    private LocalDateTime fechaEmision = LocalDateTime.now();
}