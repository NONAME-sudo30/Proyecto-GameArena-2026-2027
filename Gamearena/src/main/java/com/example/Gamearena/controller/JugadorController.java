package com.example.Gamearena.controler;

import org.springframework.web.bind.annotation.RestController;
import com.example.Gamearena.model.Jugador;
import com.example.Gamearena.service.JugadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

    // @RestController: responde peticiones HTTP y devuelve JSON
// @RequestMapping: todas las rutas empiezan por /jugadores
    @RestController
    @RequestMapping("/jugadores")
    public class JugadorController {
        private final JugadorService jugadorService;
        // El controller solo conoce al service, nunca al repository
        public JugadorController(JugadorService jugadorService) {
            this.jugadorService = jugadorService;
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
    }

