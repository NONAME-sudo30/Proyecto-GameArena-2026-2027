package com.example.Gamearena.model;
//Entidad Torneo:gestiona los torneos//

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

//la entidad Torneo Tiene un id,un nombre; una fecha y un premio//
@Entity
public class Torneo {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private LocalDate date;
    private double premio;
//Relaciones entidad relación//
    //Muchos videojuegos puede tener un torneo//
@ManyToOne
@JoinColumn(name = "videojuego_id")
private Videojuegos videojuego;
//un torneo puede tener muchos participantes//ñ
    @OneToMany(mappedBy = "torneo")
    @JsonIgnore
    private List<Participantes> participaciones;

}
