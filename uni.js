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
      const upper_band = Object.values(data.upper_band);
      const middle_band = Object.values(data.middle_band);
      const lower_band = Object.values(data.lower_band);
      const MA_7 = Object.values(data.MA_7);
      const MA_20 = Object.values(data.MA_20);
      const RSI_14 = Object.values(data.RSI_14);

      console.log(RSI_14)
      
      // call crate chart functions
      createChart1(priceUSD);
      createChart2(macd, macd_signal, macd_hist);
      createChart3(priceUSD, upper_band, middle_band, lower_band);
      createChart4(MA_7, MA_20);
      createChart5(RSI_14);
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

  // Draw chart
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


function createChart3(priceUSD, upper_band, middle_band, lower_band) {

  // Create the chart
  const ctx = document.getElementById('myChart3').getContext('2d');

  // Create arrays to hold the buy and sell signals
  let buySignals = [];
  let sellSignals = [];

  // Iterate through the price data
  for (let i = 0; i < priceUSD.length; i++) {
    // Check if price crosses above the upper band
    if (i > 0 && priceUSD[i-1] < upper_band[i-1] && priceUSD[i] > upper_band[i]) {
      buySignals.push({x: i, y: priceUSD[i]});
    }
    // Check if price crosses below the lower band
    else if (i > 0 && priceUSD[i-1] > lower_band[i-1] && priceUSD[i] < lower_band[i]) {
      sellSignals.push({x: i, y: priceUSD[i]});
    }
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [...Array(priceUSD.length).keys()],
        datasets: [
            {
                label: 'Price (USD)',
                data: priceUSD,
                borderColor: 'rgba(128, 0, 128, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Upper Band',
                data: upper_band,
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Middle Band',
                data: middle_band,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                fill: false,
            },
            {
                label: 'Lower Band',
                data: lower_band,
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1,
                fill: false,
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

function createChart4(MA_7, MA_20) {

  // Create the chart
  const ctx = document.getElementById('myChart4').getContext('2d');

  // Create arrays to store buy and sell signals
  let buySignals = [];
  let sellSignals = [];

  // Iterate through the MA_7 and MA_20 data to find buy and sell signals
  for (let i = 1; i < MA_7.length; i++) {
    // Check if MA_7 crosses above MA_20
    if (MA_7[i] > MA_20[i] && MA_7[i-1] < MA_20[i-1]) {
      buySignals.push({x: i, y: MA_7[i]});
    }
    // Check if MA_7 crosses below MA_20
    else if (MA_7[i] < MA_20[i] && MA_7[i-1] > MA_20[i-1]) {
      sellSignals.push({x: i, y: MA_7[i]});
    }
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...Array(MA_7.length).keys()],
      datasets: [
        {
          label: 'MA_7',
          data: MA_7,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false
        },
        {
          label: 'MA_20',
          data: MA_20,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: false
        },
        {
          label: 'Buy Signals',
          data: buySignals,
          borderColor: 'rgba(0, 255, 0, 1)',
          showLine: false,
          fill: false,
          pointRadius: 10,
          pointHoverRadius: 10,
        },
        {
          label: 'Sell Signals',
          data: sellSignals,
          borderColor: 'rgba(255, 0, 0, 1)',
          showLine: false,
          fill: false,
          pointRadius: 10,          
          pointHoverRadius: 10,
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

function createChart5(RSI) {
  // Initialize arrays to store buy and sell signals
  const buySignals = [];
  const sellSignals = [];
  
  // Iterate through the RSI values to find buy and sell signals
  for (let i = 0; i < RSI.length; i++) {
    // Check if RSI crosses above 50
    if (RSI[i] > 50 && RSI[i-1] <= 50) {
      buySignals.push({x: i, y: RSI[i]});
    }
    // Check if RSI crosses below 50
    else if (RSI[i] < 50 && RSI[i-1] >= 50) {
      sellSignals.push({x: i, y: RSI[i]});
    }
  }
  
  // Create the chart
  const ctx = document.getElementById('myChart5').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...Array(RSI.length).keys()],
      datasets: [
        {
          label: 'RSI',
          data: RSI,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: false
        },
        {
          label: 'Buy Signals',
          data: buySignals,
          borderColor: 'rgba(0, 255, 0, 1)',
          showLine: false,
          fill: false,
          pointRadius: 10,          
          pointHoverRadius: 10,
        },
        {
          label: 'Sell Signals',
          data: sellSignals,
          borderColor: 'rgba(255, 0, 0, 1)',
          showLine: false,
          fill: false,
          pointRadius: 10,          
          pointHoverRadius: 10,
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: 100
          }
        }]
      }
    }
  });
}
