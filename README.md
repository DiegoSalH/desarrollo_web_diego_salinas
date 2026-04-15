# Tarea 1 - Desarrollo Web

## Descripcion
Este proyecto consiste en una aplicacion web diseñada para el Departamento de Ciencias de la Computacion (DCC). Permite la visualizacion de miembros registrados, el registro de actividades que realizan los integrantes de la comunidad y la visualizacion de metricas de los registros mediante graficos.

## Decisiones tomadas
- Separa cada tipo de archivo en carpetas distintas segun tipo, para mantener mayor orden.
- Trate de mantener el mismo estilo visual en todos los modulos.
- Se utilizó flexbox para la alineacion de elementos en formularios y menu.
- Para las metricas utilize css grid para organizar los graficos.
- Separe una parte de login del registro de actividades, ya que siento que es algo mas realista y mas facil de manejar.
- En el registro de actividades se pueden añadir y quitar bloques de actividades, hasta un maximo de 5. 
- A diferencia de la validacion de login que muestra un error debajo de los input, en el registro de actividades cree una validation box, ya que era mas facil y no podia trabajar con id's.
- Para la creacion de graficos, utilize la libreria chartjs (https://www.chartjs.org/) con el fin de hacerlo un poco mas realista y poder crear graficos con los que se pueda interactuar.
- En algunas partes utilice efectos para lograr un diseño mas responsivo, por ejemplo en el menu las tarjetas tienen el efecto de levantarse cuando pasamos el mouse por encima.

## Instrucciones
1. Iniciar en la página de login y registrarse.
2. Navegar a través del manu a los diferentes módulos.
3. En el registro de actividades, se pueden añadir hasta 5 actividades simultáneas antes de enviar el formulario.
4. En metricas se pueden visualizar las estadísticas de los registros.
5. En lista de miembros, se pueden ver una tabla con todos los miembros registrados hasta ahora, junto con informacion para contactarlos. 

