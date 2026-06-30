package com.tarea4.tarea4.models;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "comuna")
public class Comuna {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nombre", length = 200, nullable = false)
    private String nombre;

    public Comuna() {
    }

    public Long getId() {
        return id;
    }

    public void setID(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
