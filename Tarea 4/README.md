# Tarea 4 - Buscador de Actividades Asíncrono

## Descripcion
Este proyecto consiste en una aplicación web desarrollada con Spring Boot, que implementa un buscador asíncrono de actividades con un sistema de evaluaciones en tiempo real sin recargar la página.

## Decisiones de diseño
- Manejo de actividades sin evaluar: Si una actividad no registra ninguna evaluación en la base de datos (promedio equivalente a `0.0`), el sistema despliega un guion (`-`) en el apartado de promedio. Apenas el usuario registra un voto, la interfaz actualiza el valor en caliente con el promedio real de notas (escala de 1 a 7).
- Destacado de texto calzado: El destacado de las coincidencias de texto se realiza en el frontend usando expresiones regulares RegEx ignorando mayúsculas/minúsculas, envolviendo el texto coincidente en etiquetas <mark> estándar de HTML

## Requisitos
- Java 17 o superior
- Spring Boot 3.x
- MySQL (Base de datos :p)

## Instrucciones
Con lo anterior instalado, y asumiendo que tiene una base de datos apropiada para la ejecucion de la tarea, ejecute el archivo Tarea4Application.java, el cual se encuentra en tarea4/src/main/java/com/tarea4/tarea4. Luego abrir en el navegador de su preferencia.

