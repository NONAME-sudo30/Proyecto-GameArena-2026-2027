package com.example.Gamearena.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nick;
    private String email;
    private int nivel;

    @OneToMany(mappedBy = "jugador")
    @JsonIgnore
    private List<Participacion> participaciones;

    public Jugador() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNick() { return nick; }
    public void setNick(String nick) { this.nick = nick; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getNivel() { return nivel; }
    public void setNivel(int nivel) { this.nivel = nivel; }

    public List<Participacion> getParticipaciones() { return participaciones; }
    public void setParticipaciones(List<Participacion> participaciones) { this.participaciones = participaciones; }
}