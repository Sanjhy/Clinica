package com.puniversidad.clinica.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "antecedentes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Antecedente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_antecedente")
    private Long codAntecedente;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_paciente", unique = true)
    private Paciente paciente;

    @Column(name = "enf_cronicas", columnDefinition = "TEXT")
    private String enfCronicas; // Guardará el JSON en texto

    @Column(columnDefinition = "TEXT")
    private String cirugias;

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(name = "medicacion_habitual", columnDefinition = "TEXT")
    private String medicacionHabitual;

    @Column(name = "antec_familiares", columnDefinition = "TEXT")
    private String antecFamiliares;

    @Column(name = "antec_quirurgicos", columnDefinition = "TEXT")
    private String antecQuirurgicos;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}