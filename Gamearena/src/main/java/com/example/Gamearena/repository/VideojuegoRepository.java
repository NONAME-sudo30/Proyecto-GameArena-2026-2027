
package com.example.Gamearena.repository;

import com.example.Gamearena.model.Videojuego;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VideojuegoRepository extends JpaRepository<Videojuego, Long> {}
