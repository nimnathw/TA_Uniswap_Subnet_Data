const express = require('express');
const request = require('request');

const app = express();

app.post('/update-chart', function(req, res) {
  // Make a POST request to the /update-chart route
  request.post('http://localhost:8080/update-chart', function (error, response, body) {
    // Print the error
    console.error('error:', error); 
    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode); 
    console.log('body:', body); 
    // Send the data received from the /update-chart route as a response to the client
    res.send(body);
  });
});

app.listen(5000, function() {
  console.log('Listening on port 5000');
});
