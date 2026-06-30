package com.tarea4.tarea4.controllers;

import com.tarea4.tarea4.models.Actividad;
import com.tarea4.tarea4.models.ActividadRepository;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.NotaRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ApiController {
    
    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public ApiController(ActividadRepository actividadRepository, NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/api/buscar")
    public List<Actividad> buscarActividades(@RequestParam("frase") String frase) {
        return actividadRepository.buscarPorFrase(frase);
    }

    @PostMapping("/api/evaluar")
    public ResponseEntity<?> evaluarActividad(@RequestParam("actividadId") Long actividadId, @RequestParam("nota") Integer valorNota) {

        Actividad actividad = actividadRepository.findById(actividadId).orElse(null);
        if (actividad == null) {
            return ResponseEntity.badRequest().body("Error: La actividad no existe >:(.");
        }

        Nota nuevaNota = new Nota(valorNota, actividad);

        try {
            notaRepository.save(nuevaNota);

            Actividad actividadActualizada = actividadRepository.findById(actividadId).get();
            List<Nota> todasLasNotas = actividadActualizada.getNotes();

            int totalEvaluaciones = todasLasNotas.size();
            double suma = 0;
            for (Nota n : todasLasNotas) {
                suma += n.getNota();
            }
            double promedio;
            if (totalEvaluaciones > 0) {
                promedio = (suma / totalEvaluaciones);
            } else {
                promedio = 0.0;
            }

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "nuevoPromedio", String.format("%.1f", promedio),
                "totalContador", totalEvaluaciones
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Nota inválida, debe ser un entero entre 1 y 7.");
        }
    }
}