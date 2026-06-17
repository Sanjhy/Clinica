package com.puniversidad.clinica.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.puniversidad.clinica.DTO.historia_clinica.request.ConsultaRequest;
import com.puniversidad.clinica.DTO.historia_clinica.response.HistorialClinicoResponse;
import com.puniversidad.clinica.model.Consulta;

@Mapper(componentModel = "spring")
public interface ConsultaMapper {

    /**
     * Convierte el formulario de consulta a entidad JPA.
     * paciente y medico se asocian en el Service (requieren búsqueda en BD).
     * codPaciente, codCita, medicamentos y examenesSolicitados son campos del DTO
     * que no existen en la entidad — se procesan manualmente en el Service.
     */
    @Mapping(target = "codConsulta",        ignore = true)
    @Mapping(target = "estado",             ignore = true)
    @Mapping(target = "fechaConsulta",      ignore = true)
    @Mapping(target = "fechaCierre",        ignore = true)
    @Mapping(target = "paciente",           ignore = true)
    @Mapping(target = "medico",             ignore = true)
    Consulta toEntity(ConsultaRequest request);
    /**
     * Convierte la entidad al resumen del historial clínico.
     * medicoNombreCompleto se construye concatenando nombre y apellidos del médico.
     * Los demás campos se mapean directamente por nombre.
     */
    @Mapping(
        target = "medicoNombreCompleto",
        expression = "java(consulta.getMedico().getNombre() + \" \" + consulta.getMedico().getApellidos())"
    )
    HistorialClinicoResponse toResponse(Consulta consulta);
}