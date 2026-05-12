


const ctxLinea = document.getElementById('graficoLinea').getContext('2d');
new Chart(ctxLinea, {
    type: 'line',
    data: {
        labels: labelsLinea,
        datasets: [{
            label: 'Total de registros diarios',
            data: valoresLinea, 
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
        labels: labelsTorta,
        datasets: [{
            label: 'Distribución de Actividades',
            data: valoresTorta, 
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