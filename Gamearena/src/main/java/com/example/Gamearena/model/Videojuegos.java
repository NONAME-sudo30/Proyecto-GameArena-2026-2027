package com.example.Gamearena.model;

//representa la tabla VIDEOJUEGO.
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Videojuegos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String genero;
    // En Jugador
    @OneToMany(mappedBy = "jugador")
    @JsonIgnore
    private List<Participantes> participaciones;
}