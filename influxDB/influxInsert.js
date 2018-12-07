// Basic use of Influx 
const Influx  = require('influx');
const os      = require('os');
const influx  = new Influx.InfluxDB({
  // set up the database
  host: 'localhost',
  database: 'Monitor',
  schema: [
    {
      measurement: 'Readings',
      fields: {
        Device: Influx.FieldType.STRING,
        Value: Influx.FieldType.STRING
      },
      tags: [
        'read_os'
      ] 
    }
  ]
})

influx.writePoints([
  {
    measurement: 'Readings', 
    tags:   { read_os: os.hostname() },
    fields: { Device: "Mag", Value: "wow" },
  }
]);

influx.query(`
    select * from Readings
    where read_os = ${Influx.escape.stringLit(os.hostname())}
    order by time desc
    limit 10
  `).then(rows => {
// provide summary to the user for each record.
  rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was 0x${row.Value}`))
});
