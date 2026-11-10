package com.example.Gamearena.repository;

import com.example.Gamearena.model.EstadoTorneo;
import com.example.Gamearena.model.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TorneoRepository extends JpaRepository<Torneo, Long> {

    List<Torneo> findByEstado(EstadoTorneo estado);

    List<Torneo> findByVideojuegoId(Long videojuegoId);

    List<Torneo> findByVideojuegoIdAndEstado(Long videojuegoId, EstadoTorneo estado);
}