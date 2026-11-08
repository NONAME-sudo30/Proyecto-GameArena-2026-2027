
package com.example.Gamearena.controller;

import com.example.Gamearena.model.Videojuego;
import com.example.Gamearena.service.VideoJuegoService;
import com.example.Gamearena.service.VideoJuegoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/videojuegos")
public class VideojuegoController {

    private final VideoJuegoService videojuegoService;

    public VideojuegoController(VideoJuegoService videojuegoService) {
        this.videojuegoService = videojuegoService;
    }

    @PostMapping
    public Videojuego crear(@RequestBody Videojuego videojuego) {
        return videojuegoService.crear(videojuego);
    }

    @GetMapping
    public List<Videojuego> listar() {
        return videojuegoService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Videojuego> buscar(@PathVariable Long id) {
        return videojuegoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}