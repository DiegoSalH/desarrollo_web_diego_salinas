const validateName = (name) => {
    if (!name) return false;
    const trimmedName = name.trim();

    const onlyLetters = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
    if (!onlyLetters.test(trimmedName)) return false;

    const parts = trimmedName.split(" ").filter(part => part.length>0) /* esto lo pongo por si llegara a ser el caso de que se el usuario pone dos espacios */

    if (parts.length === 0) return false;
    const enoughParts = parts.length >= 2; /* que se componga de Nombre y Apellido */
    
    const longEnough = parts.every(part => part.length >= 3); /* cada parte del nombre tiene minimo 3 letras */

    return enoughParts && longEnough;
};

const validateEmail = (email) => {
    if (!email) return false;
    const trimmedEmail = email.trim();

    const emailRegex = /^[^\s@]+@([a-zA-Z0-9-]+\.)*uchile\.cl$/;  /*Asumo que todos los correos institucionales terminan con uchile.cl*/

    const formatValid = emailRegex.test(trimmedEmail);

    return formatValid;
};


const validateSelect = (select) => {
    return select !== "";
};

const validatePhone = (phone) => {
    if (!phone) return false;
    const trimmedPhone = phone.trim();

    const phoneRegex = /^9[0-9]{8}$/;

    return phoneRegex.test(trimmedPhone);
};

const validateFiles = (files) => {
    return files && files.length > 0 && files.length <= 5;
};

const validateDuration = (duration) => {
    if (!duration) return false;
    const durationRegex = /^([0-9]{1,2}):([0-5][0-9])$/;
    return durationRegex.test(duration.trim());
};

let actividadesVisibles = 1;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registro-form");
    const btnAgregar = document.getElementById("boton-agregar-actividad");
    const regionSelect = document.getElementById("region-select");
    const comunaSelect = document.getElementById("comuna-select");
    const valBox = document.getElementById("val-box");
    const valList = document.getElementById("val-list");

    regionSelect.addEventListener("change", (e) => {
        const regionId = e.target.value;
        comunaSelect.innerHTML = '<option value="">Seleccione Comuna</option>';

        if (regionId) {
            const region = region_comuna.regiones.find(r => r.numero == regionId);

            if (region) {
                region.comunas.forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna.id;
                    option.textContent = comuna.nombre;
                    comunaSelect.appendChild(option);
                })
            }
        }
    });

    btnAgregar.addEventListener("click", () => {
    const bloquesOcultos = Array.from(document.querySelectorAll(".bloque-actividad"))
                                .filter(b => b.style.display === "none");

    if (bloquesOcultos.length > 0) {
        const proximoBloque = bloquesOcultos[0];
        proximoBloque.style.display = "block";
    } else {
        alert("Máximo 5 actividades permitidas.");
    }
    });

    form.addEventListener("submit", (e) => {
        let errores = [];
        if (!validateName(document.getElementById("nombre").value)) {
            errores.push("Nombre: Debe incluir nombre y apellido (mínimo 3 letras cada uno).");
        }
        if (!validateEmail(document.getElementById("email").value)) {
            errores.push("Email: Debe ser un correo valido");
        }
        const tel = document.getElementById("telefono").value;
        if (!validatePhone(tel)) {
        errores.push("Telefono: Debe empezar con 9 y tener 9 digitos.");
        }
        if (!validateSelect(regionSelect.value)) errores.push("Debe seleccionar una Región.");
        if (!validateSelect(comunaSelect.value)) errores.push("Debe seleccionar una Comuna.");

        for (let i = 1; i <= 5; i++) {
            const bloque = document.getElementById(`bloque-${i}`);
            if (bloque.style.display !== "none") {
                const nombreAct = bloque.querySelector(".input-nombre").value;
                const tipoAct = bloque.querySelector(".input-tipo").value;
                const diaAct = bloque.querySelector(".input-dia").value;
                const durAct = bloque.querySelector(".input-duracion").value;
                const inicioAct = bloque.querySelector(".input-inicio").value;
                const fotos = bloque.querySelector(".input-archivos").files;
                const descAct = bloque.querySelector(".input-desc").value;

                if (nombreAct.trim().length < 3) {
                    errores.push(`Actividad ${i}: El nombre es muy corto.`);
                }
                if (!tipoAct) {
                    errores.push(`Actividad ${i}: Debe seleccionar un tipo.`);
                }
                if (!diaAct) {
                    errores.push(`Actividad ${i}: Debe seleccionar un día.`);
                }
                if (!inicioAct) {
                    errores.push(`Actividad ${i}: Debe indicar hora de inicio.`);
                }
                if (!validateDuration(durAct)) {
                    errores.push(`Actividad ${i}: Debe indicar una duración correctamente.`);
                }
                if (!validateFiles(fotos)) {
                    errores.push(`Actividad ${i}: Debe subir entre 1 y 5 fotos.`);
                }
                if (descAct.trim().length < 5) {
                    errores.push(`Actividad ${i}: La descripción es muy corta (mínimo 5 caracteres).`);
                }
            }
        }
        
        if (errores.length > 0) {
            e.preventDefault();
            valList.innerHTML = "";
            errores.forEach(err => {
                const li = document.createElement("li");
                li.textContent = err;
                valList.appendChild(li);
            });
            valBox.hidden = false;
        }
    }); 

});

function eliminarBloque(id) {
    const bloque = document.getElementById(`bloque-${id}`);
    bloque.style.display = "none";
    bloque.querySelectorAll("input, select").forEach(el => {
        el.value = "";
        el.required = false;
    });
}

