package com.example.Gamearena.controller;
import com.example.Gamearena.model.EstadoTorneo;
import com.example.Gamearena.model.Participacion;
import com.example.Gamearena.model.Torneo;
import com.example.Gamearena.service.ParticipacionService;
import com.example.Gamearena.service.TorneoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/torneos")
public class TorneoController {
    private final TorneoService torneoService;
    private final ParticipacionService participacionService;
    public TorneoController(TorneoService torneoService, ParticipacionService participacionService) {
        this.torneoService = torneoService;
        this.participacionService = participacionService;
    }
    // ---------- CRUD ----------
    // 400 si el videojuego no viene o no existe
    @PostMapping
    public ResponseEntity<Torneo> crear(@RequestBody Torneo torneo) {
        return torneoService.crear(torneo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
    @GetMapping
    public List<Torneo> listar() {
        return torneoService.listar();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Torneo> buscar(@PathVariable Long id) {
        return torneoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Torneo> modificar(@PathVariable Long id, @RequestBody Torneo torneo) {
        return torneoService.modificar(id, torneo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (torneoService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    // ---------- Consultas ----------
    // GET /torneos/estado/ABIERTO (Spring convierte el texto al enum solo)
    @GetMapping("/estado/{estado}")
    public List<Torneo> porEstado(@PathVariable EstadoTorneo estado) {
        return torneoService.porEstado(estado);
    }
    // GET /torneos/videojuego/1
    @GetMapping("/videojuego/{videojuegoId}")
    public List<Torneo> porVideojuego(@PathVariable Long videojuegoId) {
        return torneoService.porVideojuego(videojuegoId);
    }
    // GET /torneos/videojuego/1/estado/ABIERTO (consulta compuesta)
    @GetMapping("/videojuego/{videojuegoId}/estado/{estado}")
    public List<Torneo> porVideojuegoYEstado(@PathVariable Long videojuegoId,
                                             @PathVariable EstadoTorneo estado) {
        return torneoService.porVideojuegoYEstado(videojuegoId, estado);
    }
    // ---------- Participaciones ----------
    // GET /torneos/1/participantes
    @GetMapping("/{id}/participantes")
    public List<Participacion> participantes(@PathVariable Long id) {
        return participacionService.participantesDeTorneo(id);
    }
    // POST /torneos/1/inscribir/3 -> inscribe al jugador 3 en el torneo 1
    @PostMapping("/{torneoId}/inscribir/{jugadorId}")
    public ResponseEntity<Participacion> inscribir(@PathVariable Long torneoId, @PathVariable Long jugadorId) {
        return participacionService.inscribir(jugadorId, torneoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}