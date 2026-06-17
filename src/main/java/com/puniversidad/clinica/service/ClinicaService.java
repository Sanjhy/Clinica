package com.puniversidad.clinica.service;

import com.puniversidad.clinica.DTO.historia_clinica.request.ConsultaRequest;
import com.puniversidad.clinica.DTO.historia_clinica.request.RecetaItemRequest;
import com.puniversidad.clinica.DTO.historia_clinica.response.HistorialClinicoResponse;
import com.puniversidad.clinica.mapper.ConsultaMapper;
import com.puniversidad.clinica.mapper.RecetaMapper;
import com.puniversidad.clinica.model.Cita;
import com.puniversidad.clinica.model.Consulta;
import com.puniversidad.clinica.model.Paciente;
import com.puniversidad.clinica.model.Receta;
import com.puniversidad.clinica.model.RecetaItem;
import com.puniversidad.clinica.model.Triaje;
import com.puniversidad.clinica.model.Especialidad;
import com.puniversidad.clinica.model.entity.Usuario;
import com.puniversidad.clinica.repository.CitaRepository;
import com.puniversidad.clinica.repository.ConsultaRepository;
import com.puniversidad.clinica.repository.EspecialidadRepository;
import com.puniversidad.clinica.repository.PacienteRepository;
import com.puniversidad.clinica.repository.RecetaItemRepository;
import com.puniversidad.clinica.repository.RecetaRepository;
import com.puniversidad.clinica.repository.TriajeRepository;
import com.puniversidad.clinica.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClinicaService {

    private final CitaRepository citaRepository;
    private final TriajeRepository triajeRepository;
    private final ConsultaRepository consultaRepository;
    private final RecetaRepository recetaRepository;
    private final RecetaItemRepository recetaItemRepository;
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EspecialidadRepository especialidadRepository;
    private final ConsultaMapper consultaMapper;
    private final RecetaMapper recetaMapper;

    public ClinicaService(CitaRepository citaRepository, TriajeRepository triajeRepository,
                          ConsultaRepository consultaRepository, RecetaRepository recetaRepository,
                          RecetaItemRepository recetaItemRepository, PacienteRepository pacienteRepository,
                          UsuarioRepository usuarioRepository, EspecialidadRepository especialidadRepository,
                          ConsultaMapper consultaMapper, RecetaMapper recetaMapper) {
        this.citaRepository = citaRepository;
        this.triajeRepository = triajeRepository;
        this.consultaRepository = consultaRepository;
        this.recetaRepository = recetaRepository;
        this.recetaItemRepository = recetaItemRepository;
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.especialidadRepository = especialidadRepository;
        this.consultaMapper = consultaMapper;
        this.recetaMapper = recetaMapper;
    }

    // ===================================================================
    // MÓDULO CITAS
    // ===================================================================
    @Transactional
    public Cita programarCita(Long codPaciente, Long codMedico, Integer codEspecialidad,
                              Long codAdministrativo, LocalDateTime fechaHora, String motivo) {

        Paciente paciente = pacienteRepository.findById(codPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        Usuario medico = usuarioRepository.findById(codMedico)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        Especialidad especialidad = especialidadRepository.findById(codEspecialidad)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
        Usuario administrativo = usuarioRepository.findById(codAdministrativo)
                .orElseThrow(() -> new RuntimeException("Usuario administrativo no encontrado"));

        Cita cita = Cita.builder()
                .paciente(paciente)
                .medico(medico)
                .especialidad(especialidad)
                .programadaPor(administrativo)
                .fechaHora(fechaHora)
                .motivo(motivo)
                .build();

        return citaRepository.save(cita);
    }

    // ===================================================================
    // MÓDULO TRIAJE
    // ===================================================================
    @Transactional
    public Triaje registrarTriaje(Triaje triaje, String enfermeraDni) {
        Usuario enfermera = usuarioRepository.findByDni(enfermeraDni)
                .orElseThrow(() -> new RuntimeException("Enfermera no encontrada"));

        triaje.setEnfermera(enfermera);
        triaje.setFechaTriaje(LocalDateTime.now());

        return triajeRepository.save(triaje);
    }

    @Transactional
    public Triaje registrarTriajeConCita(Triaje triaje, String enfermeraDni, Long codCita) {
        Triaje guardado = registrarTriaje(triaje, enfermeraDni);

        // Si se pasa codCita, actualizar estado de la cita a CONFIRMADA
        if (codCita != null) {
            citaRepository.findById(codCita).ifPresent(cita -> {
                cita.setEstado("CONFIRMADA");
                citaRepository.save(cita);
            });
        }

        return guardado;
    }

    // ===================================================================
    // MÓDULO HISTORIA CLÍNICA (Consultas + Recetas)
    // ===================================================================
    @Transactional
    public HistorialClinicoResponse registrarConsultaCompleta(ConsultaRequest request, String medicoDni) {

        Paciente paciente = pacienteRepository.findById(request.getCodPaciente())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        Usuario medico = usuarioRepository.findByDni(medicoDni)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        // 1. Mapear y guardar la Consulta
        Consulta consulta = consultaMapper.toEntity(request);
        consulta.setPaciente(paciente);
        consulta.setMedico(medico);
        consulta.setEstado("CERRADA");
        consulta.setFechaConsulta(LocalDateTime.now());
        consulta.setFechaCierre(LocalDateTime.now());

        // Si vino de una cita de agenda, marcarla como COMPLETADA
        if (request.getCodCita() != null) {
            citaRepository.findById(request.getCodCita()).ifPresent(cita -> {
                cita.setEstado("COMPLETADA");
                citaRepository.save(cita);
            });
        }

        Consulta consultaGuardada = consultaRepository.save(consulta);

        // 2. Si el médico agregó medicamentos, crear la Receta automáticamente
        if (request.getMedicamentos() != null && !request.getMedicamentos().isEmpty()) {
            Receta receta = Receta.builder()
                    .consulta(consultaGuardada)
                    .paciente(paciente)
                    .medico(medico)
                    .build();

            Receta recetaGuardada = recetaRepository.save(receta);

            for (RecetaItemRequest itemDto : request.getMedicamentos()) {
                RecetaItem item = recetaMapper.toItemEntity(itemDto);
                item.setReceta(recetaGuardada);
                recetaItemRepository.save(item);
            }
        }

        return consultaMapper.toResponse(consultaGuardada);
    }

    @Transactional(readOnly = true)
    public List<HistorialClinicoResponse> obtenerHistorialPaciente(Long codPaciente) {
        return consultaRepository
                .findByPacienteCodPacienteOrderByFechaConsultaDesc(codPaciente)
                .stream()
                .map(consultaMapper::toResponse)
                .collect(Collectors.toList());
    }
}