package com.example.Gamearena.service;

import com.example.Gamearena.model.Videojuego;
import com.example.Gamearena.repository.VideojuegoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VideoJuegoService {

    private final VideojuegoRepository videojuegoRepository;

    public VideoJuegoService(VideojuegoRepository videojuegoRepository) {
        this.videojuegoRepository = videojuegoRepository;
    }

    public Videojuego crear(Videojuego videojuego) {
        return videojuegoRepository.save(videojuego);
    }

    public List<Videojuego> listar() {
        return videojuegoRepository.findAll();
    }

    public Optional<Videojuego> buscarPorId(Long id) {
        return videojuegoRepository.findById(id);
    }
}