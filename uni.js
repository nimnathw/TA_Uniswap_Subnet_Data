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
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...Array(macd.length).keys()],
      datasets: [
        {
          label: 'MACD',
          data: macd,
          borderColor: 'rgba(255, 99, 132, 1)',
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
  });
}

