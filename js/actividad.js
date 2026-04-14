const maxActividades = 5;
let contadorActividades = 1;

const contenedor = document.getElementById("contenedor-actividades");
const botonAgregar = document.getElementById("boton-agregar-actividad");
const formActividades = document.getElementById("actividades-form");
const validationBox = document.getElementById("val-box");
const validationMessageElem = document.getElementById("val-msg");
const validationListElem = document.getElementById("val-list");

const validateName = (name) => {
    if (!name) return false;
    return name.trim().length >= 4;
};

const validateSelect = (select) => {
    return select !== "";
};

const validateFiles = (files) => {
    if (!files || files.length === 0) return false;
    let lengthValid = files.length <= 3;
    return lengthValid;
};

 
botonAgregar.addEventListener("click", () => { // todo esto es para agregar un nuevo bloque de actividad
    const bloquesActuales = document.querySelectorAll(".bloque-actividad").length;
    if (bloquesActuales >= maxActividades) {
        return;
    }

    contadorActividades++;

    const primerBloque = document.querySelector(".bloque-actividad");     // clonamos el primer bloque
    const nuevoBloque = primerBloque.cloneNode(true);
    
    nuevoBloque.setAttribute("data-id", contadorActividades);
    nuevoBloque.querySelector(".titulo-actividad").innerText = `Actividad ${contadorActividades}`;
    nuevoBloque.querySelectorAll("input, select").forEach(input => input.value = "");
    
    const botonEliminar = document.createElement("button");  // boton para borrar actividad
    botonEliminar.innerText = "Eliminar";
    botonEliminar.className = "boton-eliminar"; 
    botonEliminar.type = "button";
    
    botonEliminar.addEventListener("click", () => {
        nuevoBloque.remove(); 
    });

    nuevoBloque.querySelector(".titulo-actividad").appendChild(botonEliminar);
    contenedor.appendChild(nuevoBloque);
});

const validateForm = () => {

    let invalidInputs = [];
    let isValid = true;
    let actividadesRecopiladas = [];

    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid = false;
    };

    const bloques = document.querySelectorAll(".bloque-actividad");

    bloques.forEach((bloque, index) => {
        let numAct = index + 1;
        let nombre = bloque.querySelector(".input-nombre").value;
        let tipo = bloque.querySelector(".input-tipo").value;
        let dia = bloque.querySelector(".input-dia").value;
        let inicio = bloque.querySelector(".input-inicio").value;
        let fin = bloque.querySelector(".input-fin").value;
        let files = bloque.querySelector(".input-archivos").files;

        if (!validateName(nombre)) {
            setInvalidInput(`Nombre (Actividad ${numAct})`);
        };

        if (!validateSelect(tipo)) {
            setInvalidInput(`Tipo de Actividad (Actividad ${numAct})`);
        };

        if (!validateSelect(dia)) {
            setInvalidInput(`Día (Actividad ${numAct})`);
        };

        if (!inicio) {
            setInvalidInput(`Hora de Inicio (Actividad ${numAct})`);
        };

        if (!fin) {
            setInvalidInput(`Hora de Fin (Actividad ${numAct})`);
        };

        if (inicio && fin && inicio >= fin) {
            setInvalidInput(`Rango de horas inválido (Actividad ${numAct}: Fin debe ser después de Inicio)`);
        };

        if (!validateFiles(files)) {
            setInvalidInput(`Evidencia inválida o vacía (Actividad ${numAct})`);  
        };

        });

    return {isValid, invalidInputs};
};  

formActividades.addEventListener("submit", (event) => {
    event.preventDefault();

    const resultado = validateForm();
    validationListElem.innerHTML = "";
    validationBox.hidden = true;
    
    if (!resultado.isValid) {
        validationBox.hidden = false;
        validationBox.style.backgroundColor = "#fee2e2"; 
        validationBox.style.color = "#b91c1c";
        validationBox.style.borderLeftColor = "#ef4444";
        validationMessageElem.innerText = "Por favor, corrige los siguientes errores:";

        resultado.invalidInputs.forEach(errorText => {
            const li = document.createElement("li");
            li.innerText = errorText;
            validationListElem.appendChild(li);
        });
    } else {
        validationListElem.innerHTML = "";
        validationBox.hidden = true;
        formActividades.reset()
        const bloques = document.querySelectorAll("bloque-actividad");
        bloques.forEach((bloque, index) => {
            if (index > 0) {
                bloque.remove()
            }
        });
        contadorActividades = 1;
        validationBox.hidden = false;
        validationBox.style.backgroundColor = "#e8fee2"; 
        validationBox.style.color = "#1cb936";
        validationBox.style.borderLeftColor = "#46d339";
        validationMessageElem.innerText = "Validacion correcta, actividad registrada.";
         
    };
});
