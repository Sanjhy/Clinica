package com.puniversidad.clinica;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class HashGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder e = new BCryptPasswordEncoder(12);
        System.out.println("======================================");
        System.out.println("HASH_CLAVE123: " + e.encode("Clave123."));
        System.out.println("HASH_ABC123CA: " + e.encode("ABC123ca"));
        System.out.println("======================================");
    }
}
