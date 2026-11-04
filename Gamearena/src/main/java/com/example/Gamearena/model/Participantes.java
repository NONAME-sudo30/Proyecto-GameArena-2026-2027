package com.example.Gamearena.model;

import jakarta.persistence.*;


//Entidad participantes
@Entity
public class Participantes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int puntos;
    private int posicion;
    @ManyToOne
    @JoinColumn(name = "jugador_id")
    private Jugador jugador;

    @ManyToOne
    @JoinColumn(name = "torneo_id")
    private Torneo torneo;
}