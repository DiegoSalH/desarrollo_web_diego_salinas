# Tarea 2 - Desarrollo Web

## Descripcion
Esta aplicación es un sistema de gestión y registro de miembros. Permite realizar registros de usuarios, incluyendo la asociación de actividades (arte, deporte, tecnología, etc.) y la subida de evidencias fotográficas. Además, ofrece un panel de métricas visuales un listado dinámico con los últimos registros.

## Decisiones de diseño
- Se utilizó el motor de plantillas Jinja2 con un archivo base.html. Esto asegura que la navegación, los estilos globales y los scripts se carguen de manera consistente.
- Se implementó SQLAlchemy como ORM para la gestión de la base de datos.
- Para las métricas, se integró Chart.js (https://www.chartjs.org/) consumiendo datos procesados directamente desde el backend en Python.
- Se utilizo un css global, para mantener consistencia en el diseño visual.

## Instrucciones
1. Preparar bases de datos:
    - Ejecute los script SQL proporcionados, en el orden tarea2.sql y luego region-comuna.sql, para crear las tablas (miembro, actividad, foto, comuna, region).
    - Asegúrese de que la tabla de comuna y region contenga los datos iniciales, ya que son necesarios para el funcionamiento del formulario de registro.
2. Entorno:
    - Instale las dependencias necesarias, dispuestas en requirement.txt, ya sea en un ambiente virtual o no.
3. Ejecución:
    - Diríjase a la carpeta flask.
    - Inicie el servidor con python app.py.
    - Acceda a la aplicación mediante http://127.0.0.1:5000.
4. Uso de Métricas:
    - Para visualizar datos en los gráficos de la sección "Metricas y Graficos", es necesario haber realizado previamente el registro de miembros y actividades en el sistema.
