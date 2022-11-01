const mqtt = require('mqtt');

const host = 'tcp://localhost';
const username = 'MQTT_ICLIENT'; // mqtt credentials if these are needed to connect
const password = '0M1Q2T3T4';

var _mqtt_client

module.exports = {
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    _mqtt_client = mqtt.connect(host, { username: username, password: password });
    return _mqtt_client
  },

  getClient() {
    if(_mqtt_client)
      return _mqtt_client
      else console.log("Client is undefined")
  }

};