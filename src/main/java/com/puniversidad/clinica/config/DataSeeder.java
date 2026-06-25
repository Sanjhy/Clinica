package com.puniversidad.clinica.config;

import com.puniversidad.clinica.model.entity.Medicamento;
import com.puniversidad.clinica.repository.MedicamentoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(MedicamentoRepository medicamentoRepository) {
        return args -> {
            if (medicamentoRepository.count() == 0) {
                medicamentoRepository.saveAll(List.of(
                    Medicamento.builder().nombre("Paracetamol 500mg").tipo("Tabletas").stock(1500).minStock(500).estado("Óptimo").build(),
                    Medicamento.builder().nombre("Amoxicilina 500mg").tipo("Cápsulas").stock(120).minStock(300).estado("Bajo").build(),
                    Medicamento.builder().nombre("Ibuprofeno 400mg").tipo("Tabletas").stock(850).minStock(200).estado("Óptimo").build(),
                    Medicamento.builder().nombre("Suero de Rehidratación Oral").tipo("Sobres").stock(45).minStock(100).estado("Crítico").build(),
                    Medicamento.builder().nombre("Clorfenamina 4mg").tipo("Tabletas").stock(600).minStock(200).estado("Óptimo").build(),
                    Medicamento.builder().nombre("Vacuna Influenza").tipo("Ampollas").stock(15).minStock(50).estado("Crítico").build()
                ));
            }
        };
    }
}
