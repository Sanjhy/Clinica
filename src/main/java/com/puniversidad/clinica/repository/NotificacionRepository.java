package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Notificacion;
import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    // Cumple con el índice 'idx_noti_usuario' y 'idx_noti_leida' para la barra del Navbar
    List<Notificacion> findByUsuarioCodUsuarioAndLeidaFalseOrderByFechaDesc(Long codUsuario);
}