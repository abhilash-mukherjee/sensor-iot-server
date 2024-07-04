const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

require('dotenv').config(); // Ensure this is at the top to use environment variables

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Setup SerialPort with the correct path and baudRate
const port = new SerialPort({
  path: '/dev/cu.usbserial-21310',  // Confirm this is the correct serial port path on your machine
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log('Serial Port Opened');
});

parser.on('data', (sensorOutput) => {
  console.log('Received data:', sensorOutput);
  sendDataToBackend(sensorOutput.trim());
});

function sendDataToBackend(sensorOutput) {
  try {
      let floatValue = parseFloat(sensorOutput);
      if (!isNaN(floatValue)) {
          console.log(`Sending value to API: `, floatValue);
          const apiUrl = process.env.BASE_URL; // Ensure BASE_URL is defined in your .env file
          const payload = {
              ripenessValue: floatValue,
              fnvType: 'BANANA'
          };

          axios.put(apiUrl, payload)
              .catch(error => {
                  console.error('Failed to send data:', error);
              });
      } else {
          console.error('Invalid float value:', sensorOutput);
      }
  } catch (error) {
      console.error('Error parsing sensor output:', error);
  }
}