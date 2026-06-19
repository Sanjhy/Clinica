package com.puniversidad.clinica.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.puniversidad.clinica.DTO.pacientes.request.PacienteRequest;
import com.puniversidad.clinica.DTO.pacientes.response.PacienteResponse;
import com.puniversidad.clinica.model.Paciente;

@Mapper(componentModel = "spring")
public interface PacienteMapper {

    @Mapping(target = "codPaciente",    ignore = true)
    @Mapping(target = "activo",         ignore = true)
    @Mapping(target = "registradoPor",  ignore = true)
    @Mapping(target = "tipoSeguro",     ignore = true)
    @Mapping(target = "medicoAsignado", ignore = true)
    Paciente toEntity(PacienteRequest request);

    @Mapping(
        target = "nombreCompleto",
        expression = "java(paciente.getNombres() + \" \" + paciente.getApellidoPaterno()" +
                     " + (paciente.getApellidoMaterno() != null ? \" \" + paciente.getApellidoMaterno() : \"\"))"
    )
    @Mapping(target = "tipoSeguroNombre", source = "tipoSeguro.nombre")
    @Mapping(
        target = "medicoAsignadoNombre",
        expression = "java(paciente.getMedicoAsignado() != null ? paciente.getMedicoAsignado().getNombre() + \" \" + paciente.getMedicoAsignado().getApellidos() : \"Sin asignar\")"
    )
    @Mapping(target = "codMedicoAsignado", source = "medicoAsignado.codUsuario")
    PacienteResponse toResponse(Paciente paciente);

    @Mapping(target = "codPaciente",    ignore = true)
    @Mapping(target = "activo",         ignore = true)
    @Mapping(target = "registradoPor",  ignore = true)
    @Mapping(target = "tipoSeguro",     ignore = true)
    @Mapping(target = "medicoAsignado", ignore = true)
    void updateEntityFromRequest(PacienteRequest request, @MappingTarget Paciente entity);
}