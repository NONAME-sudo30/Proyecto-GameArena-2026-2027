package com.example.Gamearena.service;
import com.example.Gamearena.model.Jugador;
import com.example.Gamearena.model.Participacion;
import com.example.Gamearena.model.Torneo;
import com.example.Gamearena.repository.JugadorRepository;
import com.example.Gamearena.repository.ParticipacionRepository;
import com.example.Gamearena.repository.TorneoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ParticipacionService {
    private final ParticipacionRepository participacionRepository;
    private final JugadorRepository jugadorRepository;
    private final TorneoRepository torneoRepository;
    public ParticipacionService(ParticipacionRepository participacionRepository,
                                JugadorRepository jugadorRepository,
                                TorneoRepository torneoRepository) {
        this.participacionRepository = participacionRepository;
        this.jugadorRepository = jugadorRepository;
        this.torneoRepository = torneoRepository;
    }
    // Inscribir: compruebo que existen el jugador y el torneo y creo la participación.
    // Si falta alguno devuelvo Optional vacío (el controller responde 404)
    public Optional<Participacion> inscribir(Long jugadorId, Long torneoId) {
        Optional<Jugador> jugador = jugadorRepository.findById(jugadorId);
        Optional<Torneo> torneo = torneoRepository.findById(torneoId);
        if (jugador.isEmpty() || torneo.isEmpty()) {
            return Optional.empty();
        }
        Participacion participacion = new Participacion();
        participacion.setJugador(jugador.get());
        participacion.setTorneo(torneo.get());
        return Optional.of(participacionRepository.save(participacion));
    }
    public List<Participacion> participantesDeTorneo(Long torneoId) {
        return participacionRepository.findByTorneoId(torneoId);
    }
    public List<Participacion> deJugador(Long jugadorId) {
        return participacionRepository.findByJugadorId(jugadorId);
    }
}