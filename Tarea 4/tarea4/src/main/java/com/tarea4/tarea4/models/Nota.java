package com.tarea4.tarea4.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

@Entity
@Table
public class Nota {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(value = 1, message = "nota minima 1")
    @Max(value = 7, message = "nota maxima 7")
    @Column(name = "nota", nullable = false)
    private Integer nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actividad_id", nullable = false)
    @JsonIgnore
    private Actividad actividad;

    public Nota() {
    }

    public Nota(Integer nota, Actividad actividad) {
        this.nota = nota;
        this.actividad = actividad;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
    }
}
