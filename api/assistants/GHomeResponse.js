'use strict';

const process = require('./commandProcessor')

/**
 * Helper class to generate an AlexaResponse.
 * @class
 */
class GHomeResponse {

    /**
     * Check a value for validity or return a default.
     * @param value The value being checked
     * @param defaultValue A default value if the passed value is not valid
     * @returns {*} The passed value if valid otherwise the default value.
     */
    checkValue(value, defaultValue) {

        if (value === undefined || value === {} || value === "")
            return defaultValue;

        return value;
    }

    /**
     * Constructor for an Google Home Response.
     * @constructor
     * @param opts Contains initialization options for the response
     */
    constructor(opts) {

        if (opts === undefined)
            opts = {}

        this.requestId = opts.requestId
        this.payload = {}

    }

    addPayloadDevices(opts) {
        let devices = []
        opts.userDevices.forEach(device => {
            // Device basics
            let mac = device.mqtt_pub.slice(0, -7)
            let d = {
                    id: mac,
                    type: "action.devices.types.BATHTUB",
                    name: {
                        defaultNames: [device.BTid.slice(4, -5).replace("_", " ")],
                        name: device.tubname
                    },
                    willReportState: false,
                    roomHint: "Banheiro",
                    otherDeviceIds: [{
                        deviceId: mac
                    }]
                }
            d['attributes'] = {}

            // Device traits (custom)
            let traits = ["action.devices.traits.OnOff"]
            let toggles = []
            let n_bombs = device.infos.quantbombas
            if(n_bombs > 0){
                traits.push("action.devices.traits.Toggles")
                for(var i = 1; i <= n_bombs; i++) {
                    toggles.push({
                        name: `bomb${i}`,
                        name_values: [
                            {
                                name_synonym: [
                                    `motobomba ${i}`,
                                    `bomba ${i}`,
                                    `motor ${i}`
                                ],
                                lang: "en"
                            }
                        ]
                    })
                }
                if(n_bombs > 1) {
                    toggles.push({
                        name: `bomb all`,
                        name_values: [
                            {
                                name_synonym: [
                                    `todas as bombas`,
                                    `todas`,
                                    `todas as motobombas`
                                ],
                                lang: "en"
                            }
                        ]
                    })
                }
            }
            d['attributes']['availableToggles'] = toggles
            if(device.infos.saidaAquecedor != 0){
                traits.push("action.devices.traits.TemperatureControl")
                d['attributes']['temperatureRange'] = {
                    minThresholdCelsius: 15,
                    maxThresholdCelsius: 40
                }
                d['attributes']['temperatureStepCelsius'] = 1
                d['attributes']['temperatureUnitForUX'] = "C"
            }
            if(device.infos.saidaRGBA != 0){
                traits.push("action.devices.traits.ColorSetting")
                d['attributes']['colorModel'] = "hsv"
                d['attributes']['commandOnlyColorSetting'] = true
                traits.push("action.devices.traits.Brightness")
            }
            if(device.infos.saidaauxconf != 0)
                traits.push("action.devices.traits.Fill")

            d['traits'] = traits
            devices.push(d)
        });
        
        this.payload['agentUserId'] = opts.agentUserId
        this.payload['devices'] = devices
    }

    addPayloadDeviceValues(opts) {
        let values = {}
        if(opts.error) values = this.errorHandler(opts.error)
        else values = this.getDeviceValues(opts)

        this.payload['devices'] = {
            [opts.tub.mac]: values
        }
    }

    addPayloadCommands(opts) {
        let command = { ids: [opts.devID] }
        if(opts.error){
            let error = this.errorHandler(opts.error)
            command['status'] = error.status
            command['errorCode'] = error.errorCode
        } else {
            let states = this.getDeviceValues(opts)
            command['status'] = "SUCCESS"
            command['states'] = states
        }

        this.payload['commands'] = [command]
    }

    getDeviceValues(opts) {
        let values = {
            on: (opts.tub.infos[0].power == 1),
            online: (opts.tub.mqtt_state == 1),
            status: opts.tub.mqtt_state == 1 ? "SUCCESS" : "OFFLINE"
        }

        // Device traits (custom)
        if(opts.tub.infos[0].saidaAquecedor != 0)
            values['temperatureSetpointCelsius'] = parseInt(opts.tub.infos[0].tempset, 10)
        if(opts.tub.infos[0].sensorTemp != 0)
            values['temperatureAmbientCelsius'] = parseInt(opts.tub.infos[0].tempAgua, 10)
        if(opts.tub.infos[0].saidaRGBA != 0)
            values['color'] = {
                "spectrumHsv": {
                    "hue": 0,
                    "saturation": 0,
                    "value": 1
                  }
            }
            values['brightness'] = opts.tub.infos[0].spotsBrilho * 10
        if(opts.tub.infos[0].saidaauxconf != 0)
            values['isFilled'] = opts.tub.infos[0].nivel != 0

        return values
    }

    errorHandler(error) {
        let err = {}

        err['status'] = "ERROR"

        switch(error) {
            case 0: err['errorCode'] = "valueOutOfRange"
            break
            case 1: err['errorCode'] = "alreadyOn"
            break
            case 2: err['errorCode'] = "alreadyOff"
            break
            case 3: err['errorCode'] = "targetAlreadyReached"
            break
            case 4: err['errorCode'] = "tankEmpty"
            break
            case 5: err['errorCode'] = "deviceTurnedOff"
            break
            case 6: err['errorCode'] = "actionNotAvailable"
            break
            case 7: err['errorCode'] = "functionNotSupported"
            break
            case 8: err['errorCode'] = "deviceNotFound"
            break
            default: err['errorCode'] = "deviceOffline"
            break
        }

        return err
    }

    /**
     * Get the composed Alexa Response.
     * @returns {GHomeResponse}
     */
    get() {
        return this;
    }
}

module.exports = GHomeResponse;