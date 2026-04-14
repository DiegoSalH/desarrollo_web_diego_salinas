const Datos = [
    { id: 1, nombre: "Diego Salinas", rol: "pregrado", correo: "dsalinas@dcc.uchile.cl" },
    { id: 2, nombre: "Ana Pérez", rol: "academico", correo: "aperez@dcc.uchile.cl" },
    { id: 3, nombre: "Carlos Gómez", rol: "funcionario", correo: "cgomez@dcc.uchile.cl" },
    { id: 4, nombre: "Beatriz Rojas", rol: "postgrado", correo: "brojas@dcc.uchile.cl" },
    { id: 5, nombre: "Eduardo Silva", rol: "pregrado", correo: "esilva@dcc.uchile.cl" },
    { id: 6, nombre: "Fernanda López", rol: "academico", correo: "flopez@dcc.uchile.cl" },
    { id: 7, nombre: "Gabriel Torres", rol: "funcionario", correo: "gtorres@dcc.uchile.cl" }
];

let paginaActual = 1;
const filasPorPagina = 5;
let datosFiltrados = [...Datos];

const cuerpoTabla = document.getElementById("cuerpo-tabla");

const dibujarTabla = () => {
    cuerpoTabla.innerHTML = "";

    const indiceInicio = (paginaActual-1) * filasPorPagina;
    const indiceFin = indiceInicio + filasPorPagina;

    const datosPagina = datosFiltrados.slice(indiceInicio, indiceFin);

    datosPagina.forEach(usuario => {
        let rolNuevo = "";
        if (usuario.rol === "pregrado") rolNuevo = "Estudiante de Pregrado";
        if (usuario.rol === "postgrado") rolNuevo = "Estudiante de Postgrado";
        if (usuario.rol === "academico") rolNuevo = "Academico/a";
        if (usuario.rol === "funcionario") rolNuevo = "Funcionario/a";

        const fila = `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${rolNuevo}</td>
                <td>${usuario.correo}</td>
            </tr>
        `;
        cuerpoTabla.innerHTML += fila;
    });
    actualizarInformacionPaginacion();
};

const botonAnterior = document.getElementById("boton-anterior");
const botonSiguiente = document.getElementById("boton-siguiente");
const infoPagina = document.getElementById("info-pagina");

const actualizarInformacionPaginacion = () => {
    const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);

    infoPagina.textContent = `Pagina ${paginaActual} de ${totalPaginas}`;

    botonAnterior.disabled = (paginaActual === 1);
    botonSiguiente.disabled = (paginaActual === totalPaginas || totalPaginas === 0);
};

botonAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--; 
        dibujarTabla();
    }
});

botonSiguiente.addEventListener("click", () => {
    const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        dibujarTabla();
    }
});

const filtroRol = document.getElementById("filtro-rol");
const ordenDatos = document.getElementById("orden-datos");

const Ordenar = () => {
    const tipoOrden = ordenDatos.value;

    if (tipoOrden === "nombre-asc") {
        datosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (tipoOrden === "nombre-desc") {
        datosFiltrados.sort((a,b) => b.nombre.localeCompare(a.nombre));
    } else if (tipoOrden === "reciente") {
        datosFiltrados.sort((a, b) => b.id - a.id);
    } else if (tipoOrden === "antiguo") {
        datosFiltrados.sort((a, b) => a.id - b.id);
    }
};

filtroRol.addEventListener("change", () => {
    const opcionElegida = filtroRol.value;
    
    if (opcionElegida === "todos") {
        datosFiltrados = [...Datos];
    } else {
        datosFiltrados = Datos.filter(usuario => usuario.rol === opcionElegida);
    }

    Ordenar();

    paginaActual = 1;
    dibujarTabla();    
});

ordenDatos.addEventListener("change", () => {
    Ordenar();
    paginaActual = 1;
    dibujarTabla();
});

Ordenar();
dibujarTabla();
