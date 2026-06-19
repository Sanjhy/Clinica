package com.puniversidad.clinica.service;

import com.puniversidad.clinica.DTO.pacientes.request.PacienteRequest;
import com.puniversidad.clinica.DTO.pacientes.response.PacienteResponse;
import com.puniversidad.clinica.mapper.PacienteMapper;
import com.puniversidad.clinica.model.Paciente;
import com.puniversidad.clinica.model.TipoSeguro;
import com.puniversidad.clinica.model.entity.Usuario;
import com.puniversidad.clinica.repository.PacienteRepository;
import com.puniversidad.clinica.repository.TipoSeguroRepository;
import com.puniversidad.clinica.repository.UsuarioRepository;
import com.puniversidad.clinica.repository.AntecedenteRepository;
import com.puniversidad.clinica.repository.TriajeRepository;
import com.puniversidad.clinica.model.Antecedente;
import com.puniversidad.clinica.model.Triaje;
import com.puniversidad.clinica.DTO.pacientes.response.ExpedienteResponse;
import java.time.Period;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final TipoSeguroRepository tipoSeguroRepository;
    private final UsuarioRepository usuarioRepository;
    private final PacienteMapper pacienteMapper;
    private final AntecedenteRepository antecedenteRepository;
    private final TriajeRepository triajeRepository;

    public PacienteService(PacienteRepository pacienteRepository,
                           TipoSeguroRepository tipoSeguroRepository,
                           UsuarioRepository usuarioRepository,
                           PacienteMapper pacienteMapper,
                           AntecedenteRepository antecedenteRepository,
                           TriajeRepository triajeRepository) {
        this.pacienteRepository = pacienteRepository;
        this.tipoSeguroRepository = tipoSeguroRepository;
        this.usuarioRepository = usuarioRepository;
        this.pacienteMapper = pacienteMapper;
        this.antecedenteRepository = antecedenteRepository;
        this.triajeRepository = triajeRepository;
    }

    @Transactional
    public PacienteResponse registrarPaciente(PacienteRequest request, String usernameDniLogueado) {
        if (pacienteRepository.findByDni(request.getDni()).isPresent()) {
            throw new RuntimeException("El DNI ya existe.");
        }

        TipoSeguro seguro = tipoSeguroRepository.findById(request.getCodTipoSeguro())
                .orElseThrow(() -> new RuntimeException("Seguro no encontrado"));

        Usuario usuario = usuarioRepository.findByDni(usernameDniLogueado)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Paciente paciente = pacienteMapper.toEntity(request);
        paciente.setTipoSeguro(seguro);
        paciente.setRegistradoPor(usuario);
        paciente.setActivo(true);

        return pacienteMapper.toResponse(pacienteRepository.save(paciente));
    }

    @Transactional(readOnly = true)
    public List<PacienteResponse> listarPacientesActivos() {
        return pacienteRepository.findAll().stream()
                .filter(Paciente::getActivo)
                .map(pacienteMapper::toResponse)
                .collect(Collectors.toList());
    }

    /** Si es médico, devuelve solo SUS pacientes asignados. Si es admin/enfermera, devuelve todos. */
    @Transactional(readOnly = true)
    public List<PacienteResponse> listarSegunRol(String dniLogueado, boolean esMedico) {
        if (esMedico) {
            return pacienteRepository.findByMedicoAsignadoDniAndActivoTrue(dniLogueado)
                    .stream()
                    .map(pacienteMapper::toResponse)
                    .collect(Collectors.toList());
        }
        return listarPacientesActivos();
    }

    @Transactional(readOnly = true)
    public PacienteResponse buscarPorDni(String dni) {
        Paciente paciente = pacienteRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        return pacienteMapper.toResponse(paciente);
    }

    @Transactional
    public PacienteResponse actualizarPaciente(Long codPaciente, PacienteRequest request) {
        Paciente paciente = pacienteRepository.findById(codPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        pacienteMapper.updateEntityFromRequest(request, paciente);

        if (paciente.getTipoSeguro() == null ||
            !paciente.getTipoSeguro().getCodTipoSeguro().equals(request.getCodTipoSeguro())) {
            TipoSeguro nuevoSeguro = tipoSeguroRepository.findById(request.getCodTipoSeguro())
                    .orElseThrow(() -> new RuntimeException("Seguro no encontrado"));
            paciente.setTipoSeguro(nuevoSeguro);
        }

        return pacienteMapper.toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    public void darDeBajaLogica(Long codPaciente) {
        Paciente paciente = pacienteRepository.findById(codPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        paciente.setActivo(false);
        pacienteRepository.save(paciente);
    }

    @Transactional(readOnly = true)
    public ExpedienteResponse obtenerExpediente(Long codPaciente) {
        Paciente paciente = pacienteRepository.findById(codPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Antecedente antecedente = antecedenteRepository.findByPacienteCodPaciente(codPaciente).orElse(null);
        Triaje ultimoTriaje = triajeRepository.findFirstByPacienteCodPacienteOrderByFechaTriajeDesc(codPaciente).orElse(null);

        Integer edad = paciente.getFechaNacimiento() != null 
            ? Period.between(paciente.getFechaNacimiento(), LocalDate.now()).getYears() 
            : null;

        return ExpedienteResponse.builder()
                .codPaciente(paciente.getCodPaciente())
                .dni(paciente.getDni())
                .nombreCompleto(paciente.getNombres() + " " + paciente.getApellidoPaterno() + " " + (paciente.getApellidoMaterno() != null ? paciente.getApellidoMaterno() : ""))
                .fechaNacimiento(paciente.getFechaNacimiento())
                .edad(edad)
                .sexo(paciente.getSexo())
                .grupoSanguineo(paciente.getGrupoSanguineo())
                .telefono(paciente.getTelefono())
                .tipoSeguroNombre(paciente.getTipoSeguro() != null ? paciente.getTipoSeguro().getNombre() : "Ninguno")
                .numSeguro(paciente.getNumSeguro())
                .contactoEmergencia(paciente.getContactoEmergencia())
                .telEmergencia(paciente.getTelEmergencia())
                .alergias(antecedente != null ? antecedente.getAlergias() : "Ninguna registrada")
                .enfCronicas(antecedente != null ? antecedente.getEnfCronicas() : "Ninguna")
                .medicacionHabitual(antecedente != null ? antecedente.getMedicacionHabitual() : "Ninguna")
                .cirugias(antecedente != null ? antecedente.getCirugias() : "Ninguna")
                .ultimaPA(ultimoTriaje != null && ultimoTriaje.getPaSistolica() != null ? ultimoTriaje.getPaSistolica() + "/" + ultimoTriaje.getPaDiastolica() + " mmHg" : "-")
                .ultimaFrecuenciaCardiaca(ultimoTriaje != null && ultimoTriaje.getFrecCardiaca() != null ? ultimoTriaje.getFrecCardiaca() + " lpm" : "-")
                .ultimaSaturacionO2(ultimoTriaje != null && ultimoTriaje.getSaturacionO2() != null ? ultimoTriaje.getSaturacionO2() + "%" : "-")
                .ultimaFechaTriaje(ultimoTriaje != null ? ultimoTriaje.getFechaTriaje().toString() : "-")
                .build();
    }
}