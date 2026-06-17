package com.puniversidad.clinica;
// Asegúrate de que coincida con tu estructura de paquetes actual

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class CamPucallyaApplication extends SpringBootServletInitializer {

    // Permite desplegar el archivo WAR en un Apache Tomcat externo
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(CamPucallyaApplication.class);
    }

    // Para desarrollo local rápido (ejecutando directamente en VS Code)
    public static void main(String[] args) {
        SpringApplication.run(CamPucallyaApplication.class, args);
    }
}
