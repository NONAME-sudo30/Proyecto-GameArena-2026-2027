package com.example.Gamearena.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Videojuego {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String genero;

    @OneToMany(mappedBy = "videojuego")
    @JsonIgnore
    private List<Torneo> torneos;

    public Videojuego() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public List<Torneo> getTorneos() { return torneos; }
    public void setTorneos(List<Torneo> torneos) { this.torneos = torneos; }
}