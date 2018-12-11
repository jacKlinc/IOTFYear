// Basic use of Influx 
const Influx  = require('influx');
const os      = require('os');
// You need to create a database in the influx shell thingy (CREATE DATABASE DITdb)
const influx  = new Influx.InfluxDB({       // this acts as an initialisation for the already created database
  host: 'localhost',
  database: 'Monitor',                      // database name given 
  schema: [
    {
      measurement: 'Readings',              // like a table in RDBMS 
      fields: {
        Device: Influx.FieldType.STRING,    // Mag, Accel or LED
        Value: Influx.FieldType.STRING      // Hex value or On/Off
      },
      tags: [
        'read_os'                           // this displays gateway (raspberry pi)
      ] 
    }
  ]
})

influx.writePoints([                        // writes data to database
  {
    measurement: 'Readings', 
    tags:   { read_os: os.hostname() },
    fields: { Device: "Mag", Value: "wow" },// writes "wow" to device Mag
  }
]);

// Put this is in your readAccel/Mag function in MQTT upload script
influx.query(`
    select * from Readings
    where read_os = ${Influx.escape.stringLit(os.hostname())} 
    order by time desc
    limit 10
  `).then(rows => { // above query requests all from current host, descending order, max 10
  rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was 0x${row.Value}`))
});
