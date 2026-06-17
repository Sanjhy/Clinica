package com.puniversidad.clinica.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "receta_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecetaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_receta_item")
    private Long codRecetaItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_receta", nullable = false)
    private Receta receta;

    @Column(nullable = false, length = 150)
    private String medicamento;

    @Column(length = 50)
    private String concentracion;

    @Column(length = 30)
    @Builder.Default
    private String via = "ORAL";

    @Column(nullable = false, length = 80)
    private String dosis;

    @Column(nullable = false, length = 50)
    private String duracion;

    @Column(length = 255)
    private String instrucciones;
}