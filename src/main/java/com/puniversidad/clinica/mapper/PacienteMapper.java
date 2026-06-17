package com.puniversidad.clinica.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.puniversidad.clinica.DTO.pacientes.request.PacienteRequest;
import com.puniversidad.clinica.DTO.pacientes.response.PacienteResponse;
import com.puniversidad.clinica.model.Paciente;

@Mapper(componentModel = "spring")
public interface PacienteMapper {

    /**
     * Convierte el Request del frontend a la entidad JPA.
     * tipoSeguro y registradoPor se asocian manualmente en el Service
     * porque requieren consultas adicionales a la BD.
     * codTipoSeguro es un campo auxiliar del DTO que no existe en la entidad.
     */
    @Mapping(target = "codPaciente",    ignore = true)
    @Mapping(target = "activo",         ignore = true)
    @Mapping(target = "registradoPor",  ignore = true)
    @Mapping(target = "tipoSeguro",     ignore = true)
    Paciente toEntity(PacienteRequest request);

    /**
     * Convierte la entidad JPA al DTO de respuesta para el frontend.
     * nombreCompleto se construye concatenando los tres campos de nombre.
     * tipoSeguroNombre se extrae del objeto relacionado TipoSeguro.
     */
    @Mapping(
        target = "nombreCompleto",
        expression = "java(paciente.getNombres() + \" \" + paciente.getApellidoPaterno()" +
                     " + (paciente.getApellidoMaterno() != null ? \" \" + paciente.getApellidoMaterno() : \"\"))"
    )
    @Mapping(target = "tipoSeguroNombre", source = "tipoSeguro.nombre")
    PacienteResponse toResponse(Paciente paciente);

    /**
     * Actualiza una entidad existente con los datos del Request (para PUT/PATCH).
     * No modifica codPaciente, activo, registradoPor ni tipoSeguro.
     */
    @Mapping(target = "codPaciente",    ignore = true)
    @Mapping(target = "activo",         ignore = true)
    @Mapping(target = "registradoPor",  ignore = true)
    @Mapping(target = "tipoSeguro",     ignore = true)
    void updateEntityFromRequest(PacienteRequest request, @MappingTarget Paciente entity);
}