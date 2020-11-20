# system_sensor
A simple node app which pushes out MQTT notifications uptime, processor_use, memory_use_percent on an interval.

## Configuration

```
{
  "mqtt": {
    "host": "x.x.x.x",
    "port": 1883
  },
  "preface": "myhome",
  "delay": 300,
  "debugLog": false
}
