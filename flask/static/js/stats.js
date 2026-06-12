async function dashboard() {
    const url = "/api/stats-data";
    
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error al obtener estadisticas: ${respuesta.status}`);
        }
        const datos = await respuesta.json();

        const ctxLinea = document.getElementById('graficoLinea').getContext('2d');
        new Chart(ctxLinea, {
            type: 'line',
            data: {
                labels: datos.miembros_por_dia.labels,
                datasets: [{
                    label: 'Total de registros diarios',
                    data: datos.miembros_por_dia.valores, 
                    borderColor: '#ed0303',
                    backgroundColor: 'rgba(211, 47, 47, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        const ctxTorta = document.getElementById('graficoTorta').getContext('2d');
        new Chart(ctxTorta, {
            type: 'pie',
            data: {
                labels: datos.actividades_por_tipo.labels,
                datasets: [{
                    label: 'Distribución de Actividades',
                    data: datos.actividades_por_tipo.valores, 
                    backgroundColor: [
                        '#ed0303', 
                        '#1895e9', 
                        '#fdc537', 
                        '#26ae2a', 
                        '#8a1a9e',
                        '#e99115',
                    ],
                    hoverOffset: 10
                }]
            }
        });

        const ctxBarras = document.getElementById("graficoBarras").getContext("2d");
        new Chart(ctxBarras, {
        type: "bar",
        data: {
            labels: datos.actividades_por_comuna.labels, // Los nombres de comunas
            datasets: [{
            label: "Cantidad de Actividades",
            data: datos.actividades_por_comuna.valores, // Los totales
            backgroundColor: "#4bc0c0"
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: { beginAtZero: true } // Para que el eje Y parta obligatoriamente desde el cero
            }
        }
        });

    } catch (error) {
        console.error("Hubo un problema al cargar el dashboard:", error);
        const contenedor = document.getElementById("contenedor-dashboard");
        if (contenedor) {
            contenedor.innerHTML = "<p style='color:red; text-align:center;'>No se pudieron cargar las estadísticas en este momento.</p>";
        }
    }
}

dashboard();