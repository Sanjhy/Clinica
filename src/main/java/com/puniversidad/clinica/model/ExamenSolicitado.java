package com.puniversidad.clinica.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "examenes_solicitados")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamenSolicitado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_examen_solicitado")
    private Long codExamenSolicitado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_consulta", nullable = false)
    private Consulta consulta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_paciente", nullable = false)
    private Paciente paciente;

    @Column(name = "tipo_examen", nullable = false, length = 100)
    private String tipoExamen;

    @Column(length = 255)
    private String resultado;

    @Column(length = 30)
    private String unidad;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "PENDIENTE";

    @Column(name = "fecha_solicitud")
    @Builder.Default
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Column(name = "fecha_resultado")
    private LocalDateTime fechaResultado;
}