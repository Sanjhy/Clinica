package com.puniversidad.clinica.service;

import com.puniversidad.clinica.DTO.seguridad.request.LoginRequest;
import com.puniversidad.clinica.DTO.seguridad.response.AuthResponse;
import com.puniversidad.clinica.mapper.UsuarioMapper;
import com.puniversidad.clinica.model.entity.RefreshToken;
import com.puniversidad.clinica.model.entity.Usuario;
import com.puniversidad.clinica.repository.RefreshTokenRepository;
import com.puniversidad.clinica.repository.UsuarioRepository;
import com.puniversidad.clinica.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UsuarioMapper usuarioMapper;

    public AuthService(UsuarioRepository usuarioRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.usuarioMapper = usuarioMapper;
    }

   /** Helper interno para construir el UserDetails del usuario */
    private UserDetails toUserDetails(Usuario usuario) {
        return new User(usuario.getDni(), usuario.getPasswordHash(),
                java.util.Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre())));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // 1. Buscar por DNI primero para validar bloqueos
        Usuario usuario = usuarioRepository.findByDni(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (usuario.getBloqueadoHasta() != null && usuario.getBloqueadoHasta().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Demasiados intentos fallidos. Intente nuevamente en 15 minutos.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            usuario.setIntentosFallidos(usuario.getIntentosFallidos() + 1);
            if (usuario.getIntentosFallidos() >= 3) {
                usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(15));
                usuarioRepository.save(usuario);
                throw new RuntimeException("Demasiados intentos fallidos. Intente nuevamente en 15 minutos.");
            }
            usuarioRepository.save(usuario);
            throw new RuntimeException("Credenciales inválidas.");
        }

        // 3. Éxito: limpiar bloqueos y actualizar acceso
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuario.setUltimoAcceso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        String accessToken = jwtService.generateToken(toUserDetails(usuario));

        String rawRefreshToken = UUID.randomUUID().toString();
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .usuario(usuario)
                .token(rawRefreshToken)
                .expiraEn(LocalDateTime.now().plusDays(7))
                .revocado(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        AuthResponse response = usuarioMapper.toAuthResponse(usuario);
        response.setAccessToken(accessToken);
        response.setRefreshToken(rawRefreshToken);
        return response;
    }

    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository.findByTokenAndRevocadoFalse(rawRefreshToken)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (stored.getExpiraEn().isBefore(LocalDateTime.now())) {
            stored.setRevocado(true);
            refreshTokenRepository.save(stored);
            throw new RuntimeException("Token expirado");
        }

        Usuario usuario = stored.getUsuario();
        String newAccessToken = jwtService.generateToken(toUserDetails(usuario));

        AuthResponse response = usuarioMapper.toAuthResponse(usuario);
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(rawRefreshToken);
        return response;
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByTokenAndRevocadoFalse(rawRefreshToken)
                .ifPresent(token -> {
                    token.setRevocado(true);
                    refreshTokenRepository.save(token);
                });
    }
}