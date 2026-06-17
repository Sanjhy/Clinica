package com.puniversidad.clinica.controller;

import com.puniversidad.clinica.DTO.seguridad.request.LoginRequest;
import com.puniversidad.clinica.DTO.seguridad.response.AuthResponse;
import com.puniversidad.clinica.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Endpoint público para iniciar sesión en el sistema.
     * @Valid activa las anotaciones de validación en el DTO (ej: @NotBlank)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * POST /api/auth/refresh
     * Endpoint público para renovar el Access Token caducado usando el Refresh Token opaco.
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new RuntimeException("El Refresh Token es requerido");
        }
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }

    /**
     * POST /api/auth/logout
     * Invalida y revoca el Refresh Token en la base de datos MySQL al salir.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        return ResponseEntity.noContent().build();
    }
}