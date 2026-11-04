package com.example.Gamearena.model;
// Entidad- representa la tabla JUGADOR en la base de datos.
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
    private List<Participantes> participantes;
}
