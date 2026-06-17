package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.entity.RefreshToken;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    // Busca un refresh token válido (no revocado) para emitir nuevo access token
    Optional<RefreshToken> findByTokenAndRevocadoFalse(String token);

    // Revoca todos los tokens de un usuario (útil en cambio de contraseña o baja)
    void deleteAllByUsuarioCodUsuario(Long codUsuario);
}
