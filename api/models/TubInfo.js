var mongoose = require('mongoose');
const TubFeedbacks = require('../utils/constants/TubFeedbacks')

var TubInfoSchema = new mongoose.Schema({
        mac: {
            type: String,
            unique: true,
            required: true
        },
        BTid: {
            type: String
        },
        pword1: {
            type: String
        },
        pword2: {
            type: String
        },
        pword3: {
            type: String
        },
        pword4: {
            type: String
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        // Status infos
        firmware: {
            type: String
        },
        versao: {
            type: String
        },
        quantbombas: {
            type: String
        },
        saidaauxconf: {
            type: String
        },
        controleralo: {
            type: String
        },
        sensorTemp: {
            type: String
        },
        ligaAutom: {
            type: String
        },
        saidaAquecedor: {
            type: String
        },
        saidaRGBA: {
            type: String
        },
        tempoffset: {
            type: String
        },
        tempoN1: {
            type: String
        },
        tempoN2: {
            type: String
        },
        agendaDias: {
            type: String
        },
        agendaHor: {
            type: String
        },
        agendaMin: {
            type: String
        },
        agendaTempo: {
            type: String
        },
        estadoWifi: {
            type: String
        },
        ssid: {
            type: String
        },
        passwd: {
            type: String
        },
        ip: {
            type: String
        },
        mqttStatus: {
            type: String
        },
        mqttPUB: {
            type: String
        },
        mqttSUB: {
            type: String
        },
        backlit: {
            type: String
        },
        power: {
            type: String
        },
        tempAgua: {
            type: String
        },
        tempset: {
            type: String
        },
        aquecedor: {
            type: String
        },
        saida01: {
            type: String
        },
        saida02: {
            type: String
        },
        saida03: {
            type: String
        },
        saida04: {
            type: String
        },
        agua: {
            type: String
        },
        nivel: {
            type: String
        },
        spotsQuantLEDs: {
            type: String
        },
        fitaQuantLeds: {
            type: String
        },
        spotsEstado: {
            type: String
        },
        spotsCor: {
            type: String
        },
        spotsVel: {
            type: String
        },
        spotsBrilho: {
            type: String
        },
        spotsPadrao: {
            type: String
        },
        fitaEstado: {
            type: String
        },
        fitaCor: {
            type: String
        },
        fitaVel: {
            type: String
        },
        fitaBrilho: {
            type: String
        },
        fitaPadrao: {
            type: String
        },
        alive: {
            type: Number
        },
});

TubInfoSchema.methods.setInfo = function (tubinfos) {
        //console.log("tubinfos: "+tubinfos)
        if(tubinfos == undefined) return

        tubinfos = tubinfos.trim()
        let infos = tubinfos.split("\n")
        for(var i in infos) {
            let info = infos[i].split(/\s/)
            if(info.length > 1) {
                let key = info[0].replace(":","")
                
                var value = info[1].replace(";","")
                for(var v = 2; v < info.length; v++) {
                    value += " "+info[v].replace(";","")
                }
        
                switch(key) {
                    case TubFeedbacks.POWER:
                        this.power = value
                        break
                    case TubFeedbacks.T_AGUA:
                        this.tempAgua = value
                        break
                    case TubFeedbacks.T_SET:
                        this.tempset = value
                        break
                    case TubFeedbacks.BOMB1:
                        this.saida01 = value
                        break
                    case TubFeedbacks.BOMB2:
                        this.saida02 = value
                        break
                    case TubFeedbacks.BOMB3:
                        this.saida03 = value
                        break
                    case TubFeedbacks.BOMB4:
                        this.saida04 = value
                        break
                    case TubFeedbacks.WARMER:
                        this.aquecedor = value
                        break
                    case TubFeedbacks.FLEVEL:
                        this.nivel = value
                        break
                    case TubFeedbacks.FWATER:
                        this.agua = value
                        break
                    case TubFeedbacks.SPOT_NLED:
                        this.spotsQuantLEDs = value
                        break
                    case TubFeedbacks.SPOT_STATE:
                        this.spotsEstado = value
                        break
                    case TubFeedbacks.SPOT_COLOR:
                        this.spotsCor = value
                        break
                    case TubFeedbacks.SPOT_FSPEED:
                        this.spotsVel = value
                        break
                    case TubFeedbacks.SPOT_FBRIGHT:
                        this.spotsBrilho = value
                        break
                    case TubFeedbacks.STRIP_NLED:
                        this.fitaQuantLeds = value
                        break
                    case TubFeedbacks.STRIP_STATE:
                        this.fitaEstado = value
                        break
                    case TubFeedbacks.STRIP_COLOR:
                        this.fitaCor = value
                        break
                    case TubFeedbacks.STRIP_FSPEED:
                        this.fitaVel = value
                        break
                    case TubFeedbacks.STRIP_FBRIGHT:
                        this.fitaBrilho = value
                        break
                    case TubFeedbacks.FIRMWARE:
                        this.firmware = value
                        break
                    case TubFeedbacks.VERSION:
                        this.versao = value
                        break
                    case TubFeedbacks.HAS_WARMER:
                        this.saidaAquecedor = value
                        break
                    case TubFeedbacks.HAS_WATER_CTRL:
                        this.saidaauxconf = value
                        break
                    case TubFeedbacks.HAS_DRAIN:
                        this.controleralo = value
                        break   
                    case TubFeedbacks.AUTO_ON:
                        this.ligaAutom = value
                        break
                    case TubFeedbacks.N_BOMBS:
                        this.quantbombas = value
                        break
                    case TubFeedbacks.GET_HASTEMP:
                        this.sensorTemp = value
                        break
                    case TubFeedbacks.GET_HASCROMO:
                        this.saidaRGBA = value
                        break
                    case TubFeedbacks.GET_SPOT_CMODE:
                        this.spotsPadrao = value
                        break
                    case TubFeedbacks.GET_STRIP_CMODE:
                        this.fitaPadrao = value
                        break
                    case TubFeedbacks.GET_BACKLIGHT:
                        this.backlit = value
                        break
                    case TubFeedbacks.WIFI_STATE:
                        this.estadoWifi = value
                        break
                    case TubFeedbacks.SSID:
                        this.ssid = value
                        break
                    case TubFeedbacks.PSWD:
                        this.passwd = value
                        break
                    case TubFeedbacks.IP:
                        this.ip = value
                        break
                    case TubFeedbacks.MQTT_PUB:
                        this.mqttPUB = value
                        break
                    case TubFeedbacks.MQTT_SUB:
                        this.mqttSUB = value
                        break
                    case TubFeedbacks.MQTT_STATE:
                        this.mqttStatus = value
                        break
                    case TubFeedbacks.BTID:
                        this.BTid = value
                        break
                    case TubFeedbacks.TEMPOFFSET:
                        this.tempoffset = value
                        break
                    case TubFeedbacks.TEMPON1:
                        this.tempoN1 = value
                        break
                    case TubFeedbacks.TEMPON2:
                        this.tempoN2 = value
                        break
                    case TubFeedbacks.AGDAYS:
                        this.agendaDias = value
                        break
                    case TubFeedbacks.AGHOUR:
                        this.agendaHor = value
                        break
                    case TubFeedbacks.AGMIN:
                        this.agendaMin = value
                        break
                    case TubFeedbacks.AGTIME:
                        this.agendaTempo = value
                        break
                    default:
                    //console.log("******** KEY ERROR! **********")
                    //console.log("   >> Key not found: "+key)
                    break
                }
            }
        }
        this.alive = Date.now()
    }

module.exports = mongoose.model('TubInfo', TubInfoSchema);