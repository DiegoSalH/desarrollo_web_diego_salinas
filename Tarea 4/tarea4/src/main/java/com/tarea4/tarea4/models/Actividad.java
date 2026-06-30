package com.tarea4.tarea4.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "actividad")
public class Actividad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nombre", length = 45, nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "descripcion", columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @NotNull
    @Column(name = "dia", nullable = false)
    private String dia;

    @NotNull
    @Column(name = "tipo", nullable = false)
    private String tipo;

    @NotNull
    @Column(name = "hora_inicio", length = 5, nullable = false)
    private String horaInicio;

    @NotNull
    @Column(name = "duracion", length = 5, nullable = false)
    private String duracion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro miembro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "comuna_id", nullable = false)
    private Comuna comuna;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notes;

    public Actividad() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public Miembro getMiembro() {
        return miembro;
    }

    public void setMiembro(Miembro miembro) {
        this.miembro = miembro;
    }

    public Comuna getComuna() {
        return comuna;
    }

    public void setComuna(Comuna comuna) {
        this.comuna = comuna;
    }

    public List<Nota> getNotes() {
        return notes;
    }

    public void setNotes(List<Nota> notes) {
        this.notes = notes;
    }
}
