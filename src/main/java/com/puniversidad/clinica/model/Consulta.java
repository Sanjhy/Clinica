package com.puniversidad.clinica.model;

import com.puniversidad.clinica.model.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_consulta")
    private Long codConsulta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_medico", nullable = false)
    private Usuario medico;

    @Column(name = "tipo_consulta", nullable = false, length = 30)
    private String tipoConsulta; // CONTROL | PRIMERA_VEZ | URGENCIA

    @Column(columnDefinition = "TEXT", nullable = false)
    private String motivo;

    @Column(name = "examen_fisico", columnDefinition = "TEXT")
    private String examenFisico;

    @Column(name = "diagnostico_cie10", length = 10)
    private String diagnosticoCie10;

    @Column(name = "diagnostico_desc", nullable = false, length = 255)
    private String diagnosticoDesc;

    @Column(columnDefinition = "TEXT")
    private String evolucion;

    @Column(columnDefinition = "TEXT")
    private String indicaciones;

    @Column(length = 100)
    private String derivacion;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "ACTIVA";

    @Column(name = "fecha_consulta")
    @Builder.Default
    private LocalDateTime fechaConsulta = LocalDateTime.now();

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;
}