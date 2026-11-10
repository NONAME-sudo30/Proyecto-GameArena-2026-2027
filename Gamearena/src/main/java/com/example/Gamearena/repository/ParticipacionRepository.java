package com.example.Gamearena.repository;

import com.example.Gamearena.model.Participacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParticipacionRepository extends JpaRepository<Participacion, Long> {

    List<Participacion> findByJugadorId(Long jugadorId);

    List<Participacion> findByTorneoId(Long torneoId);
}