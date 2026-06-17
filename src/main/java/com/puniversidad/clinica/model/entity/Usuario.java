package com.puniversidad.clinica.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_usuario")
    private Long codUsuario;

    // Sincronizado: Variable 'dni' mapea directo a la columna 'username_dni'
    @Column(name = "username_dni", unique = true, nullable = false, length = 8)
    private String dni;

    // Sincronizado: Variable 'passwordHash' mapea directo a 'password_hash'
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String colegiatura;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cod_rol")
    private Rol rol;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Column(name = "ip_ultimo_acceso", length = 45)
    private String ipUltimoAcceso;
}