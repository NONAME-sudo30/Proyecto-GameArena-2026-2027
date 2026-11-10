package com.example.Gamearena.controller;

import com.example.Gamearena.model.Jugador;
import com.example.Gamearena.model.Participacion;
import com.example.Gamearena.service.JugadorService;
import com.example.Gamearena.service.ParticipacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController: responde peticiones HTTP y devuelve JSON
// @RequestMapping: todas las rutas empiezan por /jugadores
@RestController
@RequestMapping("/jugadores")
public class JugadorController {

    private final JugadorService jugadorService;
    private final ParticipacionService participacionService;

    // El controller solo conoce a los services, nunca al repository
    public JugadorController(JugadorService jugadorService, ParticipacionService participacionService) {
        this.jugadorService = jugadorService;
        this.participacionService = participacionService;
    }

    // POST /jugadores -> @RequestBody convierte el JSON del Body en un Jugador
    @PostMapping
    public Jugador crear(@RequestBody Jugador jugador) {
        return jugadorService.crear(jugador);
    }

    // GET /jugadores
    @GetMapping
    public List<Jugador> listar() {
        return jugadorService.listar();
    }

    // GET /jugadores/1 -> @PathVariable coge el {id} de la URL
    @GetMapping("/{id}")
    public ResponseEntity<Jugador> buscar(@PathVariable Long id) {
        return jugadorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /jugadores/1
    @PutMapping("/{id}")
    public ResponseEntity<Jugador> modificar(@PathVariable Long id, @RequestBody Jugador jugador) {
        return jugadorService.modificar(id, jugador)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /jugadores/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (jugadorService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // GET /jugadores/1/participaciones -> participaciones (torneos) del jugador 1
    @GetMapping("/{id}/participaciones")
    public List<Participacion> participaciones(@PathVariable Long id) {
        return participacionService.deJugador(id);
    }
}
