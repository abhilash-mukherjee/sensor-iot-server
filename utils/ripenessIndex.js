function calculateRipenessIndex(baseReading, readings) {
    if (readings.length === 0) return 0; // Prevent division by zero if no readings
    console.log("****************Base reading: ", baseReading);
    const meanReading = readings.reduce((sum, value) => sum + value, 0) / readings.length;
    console.log("****************Mean reading: ", meanReading);
    const ripenessIndex = (meanReading - baseReading) / baseReading;
    return ripenessIndex.toFixed(4) * 100;
  }
  
module.exports = calculateRipenessIndex;