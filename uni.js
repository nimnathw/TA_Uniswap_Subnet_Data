fetch('http://localhost:3000/update-chart', {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      // Extract the data for the chart
      const priceUSD = Object.values(data.priceUSD);
      const macd = Object.values(data.macd);
      const macd_signal = Object.values(data.macd_signal);
      const macd_hist = Object.values(data.macd_hist);
      console.log(macd_hist)
      
      // call crate chart functions
      createChart1(priceUSD);
      createChart2(macd, macd_signal, macd_hist);
;
    })
    .catch(error => {
      console.error(error);
    });

function createChart1(priceUSD) {
    // Create the chart
    const ctx = document.getElementById('myChart1').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [...Array(priceUSD.length).keys()],
            datasets: [{
                label: 'Price (USD)',
                data: priceUSD,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function createChart2(macd, macd_signal, macd_hist) {
  // Create the chart
  const ctx = document.getElementById('myChart2').getContext('2d');
  
  // Initialize variables to store buy and sell signal data
  let buySignals = [];
  let sellSignals = [];
  
  // Iterate through the macd, macd_signal, and macd_hist arrays
  for (let i = 1; i < macd.length; i++) {
    // Check if macd crosses above the macd_signal
    if (macd[i-1] < macd_signal[i-1] && macd[i] > macd_signal[i]) {
      buySignals.push({x: i, y: macd[i]});
    }
    // Check if macd crosses below the macd_signal
    else if (macd[i-1] > macd_signal[i-1] && macd[i] < macd_signal[i]) {
      sellSignals.push({x: i, y: macd[i]});
    }
  }


  const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [...Array(macd.length).keys()],
        datasets: [
            {
                label: 'MACD',
                data: macd,
                borderColor: 'rgba(128, 0, 128, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'MACD Signal',
                data: macd_signal,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'MACD Histogram',
                data: macd_hist,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                fill: true,
                backgroundColor: 'rgba(255, 206, 86, 0.2)'
            },
            {
                label: 'Buy Signals',
                data: buySignals,
                borderColor: 'rgba(0, 255, 0, 1)',
                pointRadius: 10,
                showLine: false,
                fill: false
            },
            {
                label: 'Sell Signals',
                data: sellSignals,
                borderColor: 'rgba(255, 0, 0, 1)',
                pointRadius: 10,
                showLine: false,
                fill: false
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
  })
};
