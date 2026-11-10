package com.example.Gamearena.service;
import com.example.Gamearena.model.Jugador;
import com.example.Gamearena.repository.JugadorRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

// @Service: le dice a Spring que esta clase es de la capa de lógica
@Service
public class JugadorService {
    private final JugadorRepository jugadorRepository;
    // Inyección por constructor: Spring nos pasa el repository ya creado
    public JugadorService(JugadorRepository jugadorRepository) {
        this.jugadorRepository = jugadorRepository;
    }
    public Jugador crear(Jugador jugador) {
        return jugadorRepository.save(jugador);
    }
    public List<Jugador> listar() {
        return jugadorRepository.findAll();
    }
    // Optional porque puede que no exista un jugador con ese id
    public Optional<Jugador> buscarPorId(Long id) {
        return jugadorRepository.findById(id);
    }
    // Busco el jugador existente, le cambio los datos y lo guardo.
    // Como ya tiene id, save hace un UPDATE y no un INSERT
    public Optional<Jugador> modificar(Long id, Jugador datos) {
        return jugadorRepository.findById(id).map(jugador -> {
            jugador.setNick(datos.getNick());
            jugador.setEmail(datos.getEmail());
            jugador.setNivel(datos.getNivel());
            return jugadorRepository.save(jugador);
        });
    }
    // Devuelve false si no existía, para que el controller responda 404
    public boolean eliminar(Long id) {
        if (!jugadorRepository.existsById(id)) {
            return false;
        }
        jugadorRepository.deleteById(id);
        return true;
    }
}