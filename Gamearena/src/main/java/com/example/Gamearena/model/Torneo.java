package com.example.Gamearena.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Torneo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private LocalDate fecha;
    private double premio;

    @Enumerated(EnumType.STRING)
    private EstadoTorneo estado;

    @ManyToOne
    @JoinColumn(name = "videojuego_id")
    private Videojuego videojuego;

    @OneToMany(mappedBy = "torneo")
    @JsonIgnore
    private List<Participacion> participaciones;

    public Torneo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public double getPremio() { return premio; }
    public void setPremio(double premio) { this.premio = premio; }

    public EstadoTorneo getEstado() { return estado; }
    public void setEstado(EstadoTorneo estado) { this.estado = estado; }

    public Videojuego getVideojuego() { return videojuego; }
    public void setVideojuego(Videojuego videojuego) { this.videojuego = videojuego; }

    public List<Participacion> getParticipaciones() { return participaciones; }
    public void setParticipaciones(List<Participacion> participaciones) { this.participaciones = participaciones; }
}