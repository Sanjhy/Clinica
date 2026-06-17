package com.puniversidad.clinica.model;

import com.puniversidad.clinica.model.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "triajes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Triaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_triaje")
    private Long codTriaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_enfermera", nullable = false)
    private Usuario enfermera;

    @Column(name = "pa_sistolica")
    private Integer paSistolica;

    @Column(name = "pa_diastolica")
    private Integer paDiastolica;

    @Column(name = "frec_cardiaca")
    private Integer frecCardiaca;

    @Column(precision = 4, scale = 1)
    private BigDecimal temperatura;

    @Column(name = "saturacion_o2")
    private Integer saturacionO2;

    @Column(name = "peso_kg", precision = 5, scale = 2)
    private BigDecimal pesoKg;

    @Column(name = "talla_cm")
    private Integer tallaCm;

    // MySQL calculará y almacenará el IMC automáticamente basándose en peso y talla
    @Column(insertable = false, updatable = false, columnDefinition = "DECIMAL(4,2) GENERATED ALWAYS AS (peso_kg / ((talla_cm / 100) * (talla_cm / 100))) STORED")
    private BigDecimal imc;

    @Column(name = "motivo_ingreso", columnDefinition = "TEXT")
    private String motivoIngreso;

    @Column(nullable = false, length = 15)
    @Builder.Default
    private String prioridad = "NORMAL"; // NORMAL | URGENTE | EMERGENCIA

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_triaje")
    @Builder.Default
    private LocalDateTime fechaTriaje = LocalDateTime.now();
}