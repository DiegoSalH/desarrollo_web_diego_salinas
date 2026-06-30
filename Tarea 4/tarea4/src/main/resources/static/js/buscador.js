const buscador = document.getElementById('buscador');
const contenedorResultados = document.getElementById('resultados');

function evaluarTexto(valor) {
    const texto = valor.trim();

    if (texto.length >= 3) {
        buscarActividades(texto);
    } else {
        contenedorResultados.innerHTML = '<p class="placeholder-texto">Ingresa al menos 3 caracteres >:( </p>';
    }
}

function destacarTexto(textoOriginal, palabraBuscada) {
    if (!textoOriginal || !palabraBuscada) return textoOriginal;
    
    const expresion = new RegExp(`(${palabraBuscada})`, 'gi');
    
    return textoOriginal.replace(expresion, '<mark>$1</mark>');
}

async function buscarActividades(frase) {
    try {
        console.log("buscando: " + frase)
        const respuesta = await fetch(`/api/buscar?frase=` + encodeURIComponent(frase));
        const actividades = await respuesta.json();
        console.log("respuesta:", actividades)

        if (actividades.length === 0) {
            contenedorResultados.innerHTML = '<p class="placeholder-texto error-texto">No se encontraron actividades D:</p>'
            return;
        }

        contenedorResultados.innerHTML = ''
        actividades.forEach(function(actividad) {
            let totalNotas = 0;
            let suma = 0;

            if (actividad.notes) {
                totalNotas = actividad.notes.length;
                actividad.notes.forEach(function(n) {
                    suma += n.nota;
                });
            }

            let promedio = '-';
            if (totalNotas > 0) {
                promedio = (suma / totalNotas).toFixed(1);
            }

            let nombreComuna = 'No especificada';
            if (actividad.comuna) {
                nombreComuna = actividad.comuna.nombre;
            }
            
            let nombreMiembro = 'No especificado';
            if (actividad.miembro) {
                nombreMiembro = actividad.miembro.nombre;
            }

            const nombreDestacado = destacarTexto(actividad.nombre, frase);
            const descDestacada = destacarTexto(actividad.descripcion, frase);
            const comunaDestacada = destacarTexto(nombreComuna, frase);


            const tarjeta = document.createElement('div');
            tarjeta.className = 'actividad-card';

            tarjeta.innerHTML = `
                <div class="info-container">
                    <h3>${nombreDestacado}</h3>
                    <p>${descDestacada}</p>
                    <div class="meta-container">
                        <span class="badge-comuna"> Comuna: ${comunaDestacada}</span>
                        <span class="badge-miembro"> Creador: ${nombreMiembro}</span>
                        <span class="badge-dia"> Día: ${actividad.dia}</span>
                        <span class="badge-tipo"> Tipo: ${actividad.tipo}</span>
                    </div>
                    <div class="meta-container" style="margin-top: 10px;">
                        <span class="badge-evaluaciones" id="total-${actividad.id}"> Evaluaciones: ${totalNotas}</span>
                        <span class="badge-promedio" id="promedio-${actividad.id}"> Promedio: ${promedio}</span>
                    </div>
                </div>
                
                <div class="evaluar-container">
                    <select id="select-${actividad.id}">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7" selected>7</option>
                    </select>
                    <button class="btn-evaluar" onclick="enviarNota(${actividad.id})">
                        Evaluar
                    </button>
                </div>
            `;
            contenedorResultados.appendChild(tarjeta);
        });
    } catch (error) {
        console.error("Error al buscar:", error);
        contenedorResultados.innerHTML = '<p class="placeholder-texto error-texto">Error de conexión.</p>';
    }
}

async function enviarNota(actividadId) {
    const selectElemento = document.getElementById('select-' + actividadId);
    const notaSeleccionada = selectElemento.value;

    const datosFormulario = new URLSearchParams();
    datosFormulario.append('actividadId', actividadId);
    datosFormulario.append('nota', notaSeleccionada);

    try {
        const respuesta = await fetch('/api/evaluar', {
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: datosFormulario
        });

        const data = await respuesta.json();
        if (respuesta.ok && data.status === "success") {
            document.getElementById('promedio-' + actividadId).innerText = 'Promedio: ' + data.nuevoPromedio;
            document.getElementById('total-' + actividadId).innerText = 'Evaluaciones: ' + data.totalContador;
        } else {
            alert('error al guardar la nota.');
        }
    } catch (error) {
        console.error("Error al evaluar", error);
        alert('no se pudo conecatr con el servidor.')
    }
}