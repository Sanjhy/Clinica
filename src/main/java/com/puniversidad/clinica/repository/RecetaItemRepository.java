package com.puniversidad.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.puniversidad.clinica.model.RecetaItem;
import java.util.List;

@Repository
public interface RecetaItemRepository extends JpaRepository<RecetaItem, Long> {
    // Obtener todos los ítems de una receta (para imprimir la receta completa)
    List<RecetaItem> findByRecetaCodReceta(Long codReceta);
}
