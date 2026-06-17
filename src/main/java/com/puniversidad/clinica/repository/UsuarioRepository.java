package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.entity.Usuario;
import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // CORREGIDO: Ahora busca por 'dni' (hace match con el campo de tu entidad Usuario)
    Optional<Usuario> findByDni(String dni);

    // CORREGIDO: Para verificar si ya existe ese DNI registrado
    boolean existsByDni(String dni);

    // Listar usuarios activos por rol
    List<Usuario> findByRolNombreAndActivoTrue(String rolNombre);
}