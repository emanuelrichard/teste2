// Import the appropriate service
const { smarthome } = require('actions-on-google')

// Other imports
const assistDAO = require('../dao/assistantDAO')
const process = require('./commandProcessor')
const mqtt_service = require('../mqtt/mqttService')
const GHomeResponse = require('./GHomeResponse')

// Create an app instance
const shome = smarthome()

// Register handlers for Smart Home intents
shome.onExecute(async (body, headers) => {
  console.log("------ GHOME: ON EXEC")
  console.log(JSON.stringify(body))
  console.log("------")

  const devID = body.inputs[0].payload.commands[0].devices[0].id
  let tub = await assistDAO.getTargetTub(devID)

  let action = body.inputs[0].payload.commands[0].execution[0].command.slice(24)
  let param = body.inputs[0].payload.commands[0].execution[0].params

  var res = ""
  if(!tub) {
    res = { err: 8 }
  } else {
    if(tub.mqtt_state == 0 || Date.now()-tub.alive > 135000) {
      res = { err: -1 }
    } else {
      switch(action) {
        case "OnOff": res = process.power(param, tub.infos[0])
        break;
        case "SetTemperature": res = process.temperature(param, tub.infos[0])
        break;
        case "Fill": res = process.waterEntry(param, tub.infos[0])
        break;
        case "SetToggles": res = process.toggles(param, tub.infos[0])
        break;
        case "ColorAbsolute": res = process.colorHSV(param, tub.infos[0])
        break;
        case "BrightnessAbsolute": res = process.bright(param, tub.infos[0])
        break;
        default: res = { err: 7 }
        break;
      }

      if(res.cmd) {
        let command = `:GH ${tub.pswd1} ${res.cmd};`
        mqtt_service.sendCommand(tub.mqtt_sub, command)
      }
    }
  }

  let ghr = new GHomeResponse({requestId: body.requestId})
  ghr.addPayloadCommands({devID: devID, tub: tub, error: res.err})
  console.log(JSON.stringify(ghr))
  console.log("------")
  return ghr
})

shome.onQuery(async (body, headers) => {
  console.log("------ GHOME: ON QUERY")
  console.log(JSON.stringify(body))

  const devID = body.inputs[0].payload.devices[0].id
  let tub = await assistDAO.getTargetTub(devID)

  let err = undefined
  if(!tub) {
    err = 8
  } else {
    if(tub.mqtt_state == 0 || Date.now()-tub.alive > 135000) {
      err = -1
    }
  }

  let ghr = new GHomeResponse({requestId: body.requestId})
  ghr.addPayloadDeviceValues({tub: tub, error: err})
  
  console.log(JSON.stringify(ghr))
  console.log("------")
  return ghr
})

shome.onSync(async (body, headers) => {
  console.log("------ GHOME: ON SYNC")

  const accessToken = headers.authorization.substr(7);
  const email = await assistDAO.getUsermail(accessToken)
  const userDevices = await assistDAO.getUserDevices(email)

  let ghr = new GHomeResponse({requestId: body.requestId})
  ghr.addPayloadDevices({userDevices: userDevices, agentUserId: email})

  console.log(JSON.stringify(ghr))
  console.log("------")
  return ghr

})

module.exports = shome