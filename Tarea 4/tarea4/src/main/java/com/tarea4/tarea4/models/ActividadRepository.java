package com.tarea4.tarea4.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    @Query("SELECT a FROM Actividad a WHERE " +
        "LOWER(a.nombre) LIKE LOWER(CONCAT('%', :frase, '%')) OR " +
        "LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :frase, '%')) OR " +
        "LOWER(a.comuna.nombre) LIKE LOWER(CONCAT('%', :frase, '%'))")
    List<Actividad> buscarPorFrase(@Param("frase") String frase);
}