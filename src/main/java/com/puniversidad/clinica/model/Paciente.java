package com.puniversidad.clinica.model;

import com.puniversidad.clinica.model.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_paciente")
    private Long codPaciente;

    @Column(name = "dni", unique = true, nullable = false, length = 8)
    private String dni;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellido_paterno", nullable = false, length = 80)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", length = 80)
    private String apellidoMaterno;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(length = 1)
    private String sexo; // M | F

    @Column(name = "grupo_sanguineo", length = 5)
    private String grupoSanguineo;

    @Column(length = 15)
    private String telefono;

    @Column(length = 200)
    private String direccion;

    @Column(length = 80)
    private String distrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_tipo_seguro")
    private TipoSeguro tipoSeguro;

    @Column(name = "num_seguro", length = 30)
    private String numSeguro;

    @Column(name = "contacto_emergencia", length = 100)
    private String contactoEmergencia;

    @Column(name = "tel_emergencia", length = 15)
    private String telEmergencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_registrado_por")
    private Usuario registradoPor;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}
