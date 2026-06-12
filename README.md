# Tarea 3 - Desarrollo Web

## Descripcion
Esta aplicación es un sistema de gestión y registro de miembros. Permite realizar registros de usuarios, incluyendo la asociación de actividades (arte, deporte, tecnología, etc.) y la subida de evidencias fotográficas. Además, ofrece un panel de métricas visuales con chart.js y un sistema interactivo de comentarios asincronos para cada actividad.

## Decisiones de diseño
- Se utilizó el motor de plantillas Jinja2 con un archivo base.html. Esto asegura que la navegación, los estilos globales y los scripts se carguen de manera consistente.
- Se implementó SQLAlchemy como ORM para la gestión de la base de datos.
- Para las métricas, se integró Chart.js (https://www.chartjs.org/) consumiendo datos dinamicos mediante Fetch api.
- Se diseñó una sección de comentarios en el detalle de cada actividad, la cual se encuentra en el detalle de cada miembro. El cliente JavaScript valida los datos en tiempo real y realiza peticiones asíncronas (GET y POST utilizando JSON) hacia Flask, permitiendo interactuar con el sistema sin recargar la página web.
- Se utilizo un css global, para mantener consistencia en el diseño visual combinado con css especificos para mantener un diseño agradable.

## Instrucciones
1. Preparar bases de datos:
    - Ejecute los script SQL proporcionados, en el orden tarea2.sql y luego region-comuna.sql, para crear las tablas (miembro, actividad, foto, comuna, region) y tabla-comentario.sql para los comentarios.
    - Asegúrese de que la tabla de comuna y region contenga los datos iniciales, ya que son necesarios para el funcionamiento del formulario de registro.
2. Entorno:
    - Instale las dependencias necesarias, dispuestas en requirement.txt, ya sea en un ambiente virtual (Opcional, muy recomendado) o no.
3. Ejecución:
    - Diríjase a la carpeta flask.
    - Inicie el servidor con python app.py.
    - Acceda a la aplicación mediante http://127.0.0.1:5000.
4. Uso de Métricas:
    - Para visualizar datos en los gráficos de la sección "Metricas y Graficos", es necesario haber realizado previamente el registro de miembros y actividades en el sistema.
