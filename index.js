//
//A simple app which pushes out MQTT notifications uptime, processor_use, memory_use_percent on an interval.
//This can be started via a Task Scheduler like pm2.

const osu = require("node-os-utils");
const os = require("os");
const mqtt = require("mqtt");
const config = require("./config.json");

const cpu = osu.cpu;
const mem = osu.mem;

const delaySeconds = config.delay;
const debugLog = config.debugLog;
const topic = `${config.preface}/${os.hostname()}`;

function log(msg, force) {
  (debugLog || force) && console.log(msg);
}

function sendData(client) {
  log("uptime=" + os.uptime());
  client.publish(`${topic}/uptime`, `${os.uptime()}`);

  cpu.usage().then((cpuPercentage) => {
    client.publish(`${topic}/processor_use`, `${cpuPercentage}`);
  });
  mem.info().then((info) => {
    client.publish(
      `${topic}/memory_use_percent`,
      `${((info.usedMemMb * 100) / info.totalMemMb).toFixed(2)}`
    );
  });

  setTimeout(sendData, delaySeconds * 1000, client);
}

const client = mqtt.connect(config.mqtt);
client.on("connect", function () {
  log(`Publishing to ${config.mqtt.host} every ${delaySeconds} seconds`, true);
  sendData(client);
});
