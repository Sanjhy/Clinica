package com.puniversidad.clinica.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles_permisos") // Forzamos el nombre de la tabla intermedia
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolPermiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_rol_permiso") // Llave primaria autoincremental propia
    private Long codRolPermiso;

    // Conexión física con la tabla Roles
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    // Conexión física con la tabla Permisos
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "permiso_id", nullable = false)
    private Permiso permiso;
}