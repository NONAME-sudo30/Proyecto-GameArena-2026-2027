package com.example.Gamearena.model;

import jakarta.persistence.*;

@Entity
public class Participacion {
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

    public Participacion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getPuntos() { return puntos; }
    public void setPuntos(int puntos) { this.puntos = puntos; }
    public int getPosicion() { return posicion; }
    public void setPosicion(int posicion) { this.posicion = posicion; }
    public Jugador getJugador() { return jugador; }
    public void setJugador(Jugador jugador) { this.jugador = jugador; }
    public Torneo getTorneo() { return torneo; }
    public void setTorneo(Torneo torneo) { this.torneo = torneo; }
}