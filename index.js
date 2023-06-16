const fs = require('fs');

const Data = fs.readFileSync('heartrate.json');
const heartRate = JSON.parse(Data);

function getDate(timestamp){
    let date = new Date(timestamp);
    let year= date.getFullYear();
    let month= String(date.getMonth()+1).padStart(2,'0');
    let day= String(date.getDay()).padStart(2,'0');
    return `${year}-${month}-${day}`;
}

let statistics  ={};
for(let i=0;i<heartRate.length;i++){
    let measurement = heartRate[i];
  let date = getDate(measurement.timestamps.startTime);
  if (!statistics[date]) {
    statistics[date] = {
      min: measurement.beatsPerMinute,
      max: measurement.beatsPerMinute,
      sum: measurement.beatsPerMinute,
      count: 1,
      timestamps: measurement.timestamps.endTime,
    };
  } else {
    let stats = statistics[date];
    stats.min = Math.min(stats.min, measurement.beatsPerMinute);
    stats.max = Math.max(stats.max, measurement.beatsPerMinute);
    stats.sum += measurement.beatsPerMinute;
    stats.count++;
    stats.timestamps = measurement.timestamps.endTime;
  }
}

for (const date in statistics) {
    const stats = statistics[date];
    stats.median = Math.round(stats.sum / stats.count);
    delete stats.sum;
    delete stats.count;
  }

  const output = [];
for (const date in statistics) {
  const stats = statistics[date];
  output.push({
    date: date,
    min: stats.min,
    max: stats.max,
    median: stats.median,
    latestDataTimestamp: stats.timestamps,
  });
}


fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

console.log('Output has been written to output.json');