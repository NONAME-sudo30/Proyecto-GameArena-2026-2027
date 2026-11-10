package com.example.Gamearena.service;

import com.example.Gamearena.model.EstadoTorneo;
import com.example.Gamearena.model.Torneo;
import com.example.Gamearena.repository.TorneoRepository;
import com.example.Gamearena.repository.VideojuegoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TorneoService {

    private final TorneoRepository torneoRepository;
    private final VideojuegoRepository videojuegoRepository;

    // Necesito el repository de Videojuego para asociarlo al crear el torneo
    public TorneoService(TorneoRepository torneoRepository, VideojuegoRepository videojuegoRepository) {
        this.torneoRepository = torneoRepository;
        this.videojuegoRepository = videojuegoRepository;
    }

    // En el JSON llega solo { "videojuego": { "id": 1 } }.
    // Busco el videojuego real en la BD y se lo asigno al torneo.
    // Si no viene videojuego o no existe, devuelvo Optional vacío (el controller responde 400)
    public Optional<Torneo> crear(Torneo torneo) {
        if (torneo.getVideojuego() == null || torneo.getVideojuego().getId() == null) {
            return Optional.empty();
        }
        return videojuegoRepository.findById(torneo.getVideojuego().getId())
                .map(videojuego -> {
                    torneo.setVideojuego(videojuego);
                    return torneoRepository.save(torneo);
                });
    }

    public List<Torneo> listar() {
        return torneoRepository.findAll();
    }

    public Optional<Torneo> buscarPorId(Long id) {
        return torneoRepository.findById(id);
    }

    public Optional<Torneo> modificar(Long id, Torneo datos) {
        return torneoRepository.findById(id).map(torneo -> {
            torneo.setNombre(datos.getNombre());
            torneo.setFecha(datos.getFecha());
            torneo.setPremio(datos.getPremio());
            torneo.setEstado(datos.getEstado());
            // Si me mandan un videojuego nuevo, lo cambio (si existe)
            if (datos.getVideojuego() != null && datos.getVideojuego().getId() != null) {
                videojuegoRepository.findById(datos.getVideojuego().getId())
                        .ifPresent(torneo::setVideojuego);
            }
            return torneoRepository.save(torneo);
        });
    }

    public boolean eliminar(Long id) {
        if (!torneoRepository.existsById(id)) {
            return false;
        }
        torneoRepository.deleteById(id);
        return true;
    }

    // Consultas derivadas del repository
    public List<Torneo> porEstado(EstadoTorneo estado) {
        return torneoRepository.findByEstado(estado);
    }

    public List<Torneo> porVideojuego(Long videojuegoId) {
        return torneoRepository.findByVideojuegoId(videojuegoId);
    }

    // Consulta compuesta: torneos de un videojuego que están en un estado concreto
    public List<Torneo> porVideojuegoYEstado(Long videojuegoId, EstadoTorneo estado) {
        return torneoRepository.findByVideojuegoIdAndEstado(videojuegoId, estado);
    }
}