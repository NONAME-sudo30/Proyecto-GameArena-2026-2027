package com.example.Gamearena.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
    @Entity
    public class Jugador {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String nick;
        private String email;
        private int nivel;
        // constructor vacío, getters y setters
    }
