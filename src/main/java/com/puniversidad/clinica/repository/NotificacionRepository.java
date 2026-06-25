package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.Notificacion;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    // Cumple con el índice 'idx_noti_usuario' y 'idx_noti_leida' para la barra del Navbar
    List<Notificacion> findByUsuarioCodUsuarioAndLeidaFalseOrderByFechaDesc(Long codUsuario);

    // Obtener todas las notificaciones de un usuario (leídas o no)
    List<Notificacion> findByUsuarioCodUsuarioOrderByFechaDesc(Long codUsuario);

    @Query("SELECT n FROM Notificacion n WHERE (n.usuario.codUsuario = :me AND n.emisor.codUsuario = :other) OR (n.usuario.codUsuario = :other AND n.emisor.codUsuario = :me) ORDER BY n.fecha ASC")
    List<Notificacion> findChatHistory(@Param("me") Long me, @Param("other") Long other);

    @Query("SELECT n FROM Notificacion n WHERE n.usuario.codUsuario = :me AND n.referenciaTipo = :grupo ORDER BY n.fecha ASC")
    List<Notificacion> findGroupChatHistory(@Param("me") Long me, @Param("grupo") String grupo);
}