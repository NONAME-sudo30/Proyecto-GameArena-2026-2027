package com.example.Gamearena.Repository;

import com.example.Gamearena.model.Participantes;
import com.example.Gamearena.model.Torneo;
import com.example.Gamearena.model.Videojuegos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public class Repositoryes {

    public interface VideojuegoRepository extends JpaRepository<Videojuegos, Long> {}
    public interface TorneoRepository extends JpaRepository<Torneo, Long> {
        List<Torneo> findByVideojuegoId(Long videojuegoId);

    }

    public interface ParticipacionRepository extends JpaRepository<Participantes, Long> {
        List<Participantes> findByJugadorId(Long jugadorId);
        List<Participantes> findByTorneoId(Long torneoId);
    }
}
