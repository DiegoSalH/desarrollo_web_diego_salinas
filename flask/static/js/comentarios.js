const validateName = (nombre) => {
    return nombre.trim() !== "" && nombre.length <= 80 && nombre.length >= 3;
};

const validateComment = (comment) => {
    return comment.trim() !== "" && comment.length <= 300 && comment.length >= 5;
};


const actividadId = document.getElementById("actividad-id").value;
const listaComentarios = document.getElementById("lista-comentarios");
const formulario = document.getElementById("form-comentario");
const errorNombre = document.getElementById("error-nombre");
const errorComentario = document.getElementById("error-comentario");

async function cargarComentarios() {
    try {
        const respuesta = await fetch(`/api/comentarios/${actividadId}`);
        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los comentarios");   
        }
        const comentarios = await respuesta.json();

        if (comentarios.length === 0) {
            listaComentarios.innerHTML = "<p class='no-comments'>No hay comentarios aun. Se el primero en comentar :D</p>";
            return;
        }

        listaComentarios.innerHTML = "";
        comentarios.forEach(c => {
            listaComentarios.innerHTML += `
                <div class="comentario-item">
                    <strong>${c.nombre}</strong> <small>(${c.fecha})</small>
                    <p>${c.texto}</p>
                </div>
            `;
        })
    } catch (error) {
        console.error("Error en cargar comentarios:", error);
        listaComentarios.innerHTML = "<p>Error al cargar los comentarios.</p>";
    }
}

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombreInput = document.getElementById("comentario-nombre").value;
    const textoInput = document.getElementById("comentario-texto").value;
    errorNombre.textContent = "";
    errorNombre.classList.remove("visible");
    errorComentario.textContent = "";
    errorComentario.classList.remove("visible");
    
    let formularioValido = true;

    if (!validateName(nombreInput)) {
        errorNombre.textContent = "Nombre invalido (no puede estar vacío y debe tener entre 3 y 80 caracteres).";
        errorNombre.classList.add("visible");
        formularioValido = false;
    }

    if (!validateComment(textoInput)) {
        errorComentario.textContent = "Comentario inválido (no puede estar vacío y debe tener entre 5 y 300 caracteres).";
        errorComentario.classList.add("visible");
        formularioValido = false;
    }

    if (!formularioValido) {
        return;
    }

    const nuevoComentario = {
        nombre: nombreInput.trim(),
        texto: textoInput.trim(),
        actividad_id: parseInt(actividadId)
    };

    try {
        const respuesta = await fetch("/api/comentarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoComentario)
        });
        const resultado = await respuesta.json();
        if (respuesta.ok && resultado.status == "success") {
            formulario.reset();
            await cargarComentarios();
        } else {
            alert("Error del servidor: " + (resultado.error || "No se pudo guardar el comentario"));
        }
    } catch (error) {
        console.error("Error en POST", error);
        alert("Hubo un problema de red al intentar publicar tu comentario.");
    }
});

cargarComentarios();