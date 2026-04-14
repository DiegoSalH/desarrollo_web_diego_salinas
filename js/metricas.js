
const miembros = [1, 2, 3, 4, 5, 6, 7];
const actividades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const ctxLinea = document.getElementById('graficoLinea').getContext('2d');
new Chart(ctxLinea, {
    type: 'line',
    data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        datasets: [{
            label: 'Total de registros diarios',
            data: [2, 5, 12, 18, 25, 30], 
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
        labels: ['Artística', 'Deportiva', 'Social', 'Tecnológica', 'Recreativa'],
        datasets: [{
            label: 'Distribución de Actividades',
            data: [15, 35, 20, 40, 10], 
            backgroundColor: [
                '#ed0303', 
                '#1895e9', 
                '#fdc537', 
                '#26ae2a', 
                '#8a1a9e'  
            ],
            hoverOffset: 10
        }]
    }
});