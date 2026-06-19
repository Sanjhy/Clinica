package com.puniversidad.clinica;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Clase utilitaria para generar hashes BCrypt.
 * Ejecutar con: mvnw exec:java -Dexec.mainClass="com.puniversidad.clinica.GenerarHash"
 */
public class GenerarHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password = "Clave123.";
        String hash = encoder.encode(password);
        System.out.println("\n========================================");
        System.out.println("PASSWORD: " + password);
        System.out.println("HASH BCrypt-12: " + hash);
        System.out.println("========================================\n");
        System.out.println("SQL para actualizar:");
        System.out.println("UPDATE usuarios SET password_hash = '" + hash + "'");
        System.out.println("WHERE username_dni IN ('11111111','22222222','33333333','44444444');");
    }
}
