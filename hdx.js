try {
  // Get the data from the hdx.py file
  fetch('http://localhost:3000/update-chart', {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      // Extract the data for the chart
      const priceUSD = Object.values(data.priceUSD);
    
    // Create the chart
    const ctx = document.getElementById('myChart1').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...Array(priceUSD.length).keys()], // create labels for each data point
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
    })
    .catch(error => {
      console.error(error);
    });
} catch (error) {
  console.error(error);
}
