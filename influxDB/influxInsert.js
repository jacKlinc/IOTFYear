//Example node.js app for inserting data into Influxdb database
//NOTE: before running this you need to create an empty waves database by going into the influx //client and typing in
// influx>create database waves;
//
//include the required npm modules
const Influx  = require('influx');
const os      = require('os');
// const influx  = new Influx.InfluxDB({
//   // set up the database
//   host: 'localhost',
//   database: 'BabyMonitor',
//   schema: [
//     {
//       measurement: 'Accel',
//       fields: {
//         //there are two fields
//         X_Accel: Influx.FieldType.STRING,
//         Y_Accel: Influx.FieldType.STRING,
//         Z_Accel: Influx.FieldType.STRING
//       },
//       //this tag would be included with the timestamp in the index, to allow individual machines to be queried.
//       tags: [
//         'acc'
//       ]
//     }
//   ]
// })

const myDB = new Influx.InfluxDB('var/lib/influxdb/wal/BabyMonitor')

var i = 0;
while (i < 3){
  myDB.writePoints( [ 
    {           
      measurement: 'Readings',                    // Readings is the tag
      tags: { host: 'localhost' },                
      fields: { Device: "Mag", Value: "1" },      // 
    }
  ])
}

// //do a select statement to get the data back.
// influx.query(`
//     select * from Accel
//     where acc = ${Influx.escape.stringLit(os.hostname())}
//     order by time desc
//     limit 10
//   `).then(rows => {
// // provide summary to the user for each record.
//   rows.forEach(row => console.log(`The wave period at ${row.buoy_os} was ${row.wave_period}s and wave height was ${row.wave_height}cm`))
// });
  
// // random number generator to add new wave data.
// function random (low, high) { return Math.floor(Math.random() * (high - low) + low); }