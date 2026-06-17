package com.puniversidad.clinica.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.puniversidad.clinica.DTO.historia_clinica.request.RecetaItemRequest;
import com.puniversidad.clinica.model.RecetaItem;

@Mapper(componentModel = "spring")
public interface RecetaMapper {

    /**
     * Convierte un ítem del formulario de receta a entidad JPA.
     * receta se asocia manualmente en el Service al padre correspondiente.
     * codRecetaItem lo genera la BD (autoincrement).
     * Todos los demás campos (medicamento, concentracion, via, dosis, duracion, instrucciones)
     * se mapean directamente por nombre coincidente.
     */
    @Mapping(target = "codRecetaItem", ignore = true)
    @Mapping(target = "receta",        ignore = true)
    RecetaItem toItemEntity(RecetaItemRequest request);
}