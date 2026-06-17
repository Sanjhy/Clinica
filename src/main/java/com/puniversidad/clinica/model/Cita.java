package com.puniversidad.clinica.model;

import com.puniversidad.clinica.model.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "citas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_cita")
    private Long codCita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_medico", nullable = false)
    private Usuario medico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_especialidad", nullable = false)
    private Especialidad especialidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_usuario_programador", nullable = false)
    private Usuario programadaPor;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "duracion_min")
    @Builder.Default
    private Integer duracionMin = 30;

    @Column(nullable = false, length = 200)
    private String motivo;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "PROGRAMADA";

    @Column(length = 255)
    private String observaciones;
}