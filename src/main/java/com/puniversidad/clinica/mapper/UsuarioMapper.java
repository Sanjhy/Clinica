package com.puniversidad.clinica.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.puniversidad.clinica.DTO.seguridad.response.AuthResponse;
import com.puniversidad.clinica.model.entity.Usuario;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    /**
     * Transforma el Usuario autenticado a la respuesta del login.
     * accessToken y refreshToken se generan e inyectan en el AuthService,
     * no vienen de la entidad.
     * nombreCompleto se construye concatenando nombre y apellidos.
     * rol se extrae del nombre del objeto Rol relacionado.
     */
    @Mapping(target = "accessToken",    ignore = true)
    @Mapping(target = "refreshToken",   ignore = true)
    @Mapping(target = "nombreCompleto", expression = "java(usuario.getNombre() + \" \" + usuario.getApellidos())")
    @Mapping(target = "rol",            source = "rol.nombre")
    @Mapping(target = "codUsuario",     source = "codUsuario")
    @Mapping(target = "username",       source = "dni")
    AuthResponse toAuthResponse(Usuario usuario);
}