const ApiError = require('../models/apiError')
const TubInfo = require('../models/TubInfo')
const Tub = require('../models/Tub')
const TubFeedbacks = require('../utils/constants/TubFeedbacks')
const Notification = require('../notifications/notifications')

const mqtt_service = require('../mqtt/mqttService')

module.exports = {
    
    saveTubInfo(BTid, pw1, pw2, pw3, pw4, fw, v, qtBombs, b2Cfg, 
        hTemp, autoOn, hWarmer, hRGBA, tOffset, tN1, tN2, agDays, agHour, agMin,
        agTime, wifi, ssid, pswd,ip, mqtt, pub, sub, bklight, power, wTemp, sTemp,
        warmer, b1, b2, b3, b4, lvl, nSpots, nStrip, spotState, spotStatic, spotSpeed,
        spotBright, spotsCMode, stripState, stripStatic, stripSpeed, stripBright,
        stripCMode, response) {
        let mac = Tub.getMac(pub)
        TubInfo.findOne({ mac: mac }, (err, tubinfo) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST TUBINFO 1"))
                return
            }
            if (tubinfo) {  // Tubinfo already registered

                // Update tubinfo
                tubinfo.mac = mac
                tubinfo.BTid = BTid
                tubinfo.pword1 = pw1
                tubinfo.pword2 = pw2
                tubinfo.pword3 = pw3
                tubinfo.pword4 = pw4
                tubinfo.date = Date.now()
                tubinfo.firmware = fw
                tubinfo.versao = v
                tubinfo.quantbombas = qtBombs
                tubinfo.saidaauxconf = b2Cfg
                tubinfo.sensorTemp = hTemp
                tubinfo.ligaAutom = autoOn
                tubinfo.saidaAquecedor = hWarmer
                tubinfo.saidaRGBA = hRGBA
                tubinfo.tempoffset = tOffset
                tubinfo.tempoN1 = tN1
                tubinfo.tempoN2 = tN2
                tubinfo.agendaDias = agDays
                tubinfo.agendaHour = agHour
                tubinfo.agendaMin = agMin
                tubinfo.agendaTempo = agTime
                tubinfo.estadoWifi = wifi
                tubinfo.ssid = ssid
                tubinfo.passwd = pswd
                tubinfo.ip = ip
                tubinfo.mqttStatus = mqtt
                if(mqtt == 2) {
                    tubinfo.alive = Date()
                }
                tubinfo.mqttPUB = pub
                tubinfo.mqttSUB = sub
                tubinfo.backlit = bklight
                tubinfo.power = power
                tubinfo.tempAgua = wTemp
                tubinfo.tempset = sTemp
                tubinfo.aquecedor = warmer
                tubinfo.saida01 = b1
                tubinfo.saida02 = b2
                tubinfo.saida03 = b3
                tubinfo.saida04 = b4
                tubinfo.nivel = lvl
                tubinfo.spotsQuantLEDs = nSpots
                tubinfo.fitaQuantLeds = nStrip
                tubinfo.spotsEstado = spotState
                tubinfo.spotsCor = spotStatic
                tubinfo.spotsVel = spotSpeed
                tubinfo.spotsBrilho = spotBright
                tubinfo.spotsPadrao = spotsCMode
                tubinfo.fitaEstado = stripState
                tubinfo.fitaCor = stripStatic
                tubinfo.fitaVel = stripSpeed
                tubinfo.fitaBrilho = stripBright
                tubinfo.fitaPadrao = stripCMode

                tubinfo.save((err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "POST TUBINFO 2"))
                        return
                    }
                    saveTub(tubinfo)

                    response.status(200).json(tubinfo)
                })
                return
            }
            
            // No TubInfo registered, it's a new TubInfo
            var tubinfo = new TubInfo({
                mac: mac,
                BTid: BTid,
                pword1: pw1,
                pword2: pw2,
                pword3: pw3,
                pword4: pw4,
                firmware: fw,
                versao: v,
                quantbombas: qtBombs,
                saidaauxconf: b2Cfg,
                sensorTemp: hTemp,
                ligaAutom: autoOn,
                saidaAquecedor: hWarmer,
                saidaRGBA: hRGBA,
                tempoffset: tOffset,
                tempoN1: tN1,
                tempoN2: tN2,
                agendaDias: agDays,
                agendaHour: agHour,
                agendaMin: agMin,
                agendaTempo: agTime,
                estadoWifi: wifi,
                ssid: ssid,
                passwd: pswd,
                ip: ip,
                mqttStatus: mqtt,
                mqttPUB: pub,
                mqttSUB: sub,
                backlit: bklight,
                power: power,
                tempAgua: wTemp,
                tempset: sTemp,
                aquecedor: warmer,
                saida01: b1,
                saida02: b2,
                saida03: b3,
                saida04: b4,
                nivel: lvl,
                spotsQuantLEDs: nSpots,
                fitaQuantLeds: nStrip,
                spotsEstado: spotState,
                spotsCor: spotStatic,
                spotsVel: spotSpeed,
                spotsBrilho: spotBright,
                spotsPadrao: spotsCMode,
                fitaEstado: stripState,
                fitaCor: stripStatic,
                fitaVel: stripSpeed,
                fitaBrilho: stripBright,
                fitaPadrao: stripCMode
            })

            tubinfo.save((err) => {
                if (err) {
                    response.status(500).json(new ApiError(err.message, "POST TUBINFO 3"))
                    return
                }
                saveTub(tubinfo)
                
                response.status(201).json(tubinfo)
            })
        })
    },

    saveMQTTTubInfo(mac, feedback) {
        TubInfo.findOne({ mac: mac }, (err, tubinfo) => {
            if (err) {
                console.log(JSON.stringify(new ApiError(err.message, "MQTT TUBINFO/ID 1")))
                return
            }

            if(tubinfo){
                shouldNotifyTubEvent(tubinfo, feedback)
                tubinfo.setInfo(feedback)
                tubinfo.mqttStatus = 1
                tubinfo.estadoWifi = 2
                tubinfo.date = Date.now()
                tubinfo.save((err) => {
                    if (err) {
                        console.log(JSON.stringify(new ApiError(err.message, "MQTT TUBINFO/ID 2")))
                        return
                    }
                    saveTubOnline(tubinfo)
                })
                return
            }

            let newTubInfo = TubInfo({
                mac: mac,
            })
            newTubInfo.setInfo(feedback)
            newTubInfo.mqttStatus = 1
            newTubInfo.estadoWifi = 2
            newTubInfo.save((err) => {
                if (err) {
                    console.log(JSON.stringify(new ApiError(err.message, "MQTT TUBINFO/ID 3")))
                    return
                }
                saveTubOnline(tubinfo)
            })
        })
    },

    getTubInfo(mac, response) {
        TubInfo.findOne({ mac: mac }, (err, tubinfo) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET TUBINFO/ID 1"))
                return
            }
            return tubinfo
        })
    },

    deleteTubInfo(mac){

        TubInfo.findOne({ mac: mac }, (err, tubinfo) => { // TODO: Call from delete tub?
            if (err) {
                console.log(JSON.stringify(new ApiError(err.message, "DELETE TUBINFO 1")))
                return
            }
            if (tubinfo) {
                tubinfo.remove(function (err) {
                    if (err) { console.log(JSON.stringify(new ApiError(err.message, "DELETE TUBINFO 2"))) }                   
                })
                return
            }
            return
        })
    },

}

function saveTub(tubinfo) {
    Tub.findOne({ mac: tubinfo.mac }, (err, tub) => {
        if (err) {
            console.log("POST TUBINFO 4 - "+err.message)
            return
        }

        if(tub) {
            tub.mac = tubinfo.mac
            tub.pswd1 = tubinfo.pword1
            tub.pswd2 = tubinfo.pword2
            tub.pswd3 = tubinfo.pword3
            tub.pswd4 = tubinfo.pword4
            tub.wifi_state = tubinfo.estadoWifi
            tub.ip = tubinfo.ip
            tub.ssid = tubinfo.ssid
            tub.mqtt_state = tubinfo.mqttStatus
            if(tubinfo.alive) {
                tub.alive = tubinfo.alive
            }
            tub.date = Date.now()

            tub.save((err) => {
                if (err) {
                    console.log("POST TUBINFO 5 - "+err.message)
                    return
                }
            })
        }
    })
}

function saveTubOnline(tubinfo) {
    Tub.findOne({ mac: tubinfo.mac }, (err, tub) => {
        if (err) {
            console.log("POST TUBINFO 6 - "+err.message)
            return
        }

        if(tub && tubinfo.alive) {
            tub.alive = tubinfo.alive
            tub.wifi_state = tubinfo.estadoWifi
            tub.mqtt_state = tubinfo.mqttStatus
            tub.date = Date.now()

            tub.save((err) => {
                if (err) {
                    console.log("POST TUBINFO 7 - "+err.message)
                    return
                }
            })
        }
    })
}

function shouldNotifyTubEvent(tubinfo, feedback) {
    
    feedback = feedback.trim()
    let infos = feedback.split("\n")
    for(var i in infos) {
        let info = infos[i].split(/\s/)
        if(info.length > 1) {
            let key = info[0].replace(":","")
            var value = info[1].replace(";","")

            switch(key) {
                case TubFeedbacks.T_AGUA:
                    if(value == tubinfo.tempset && value != tubinfo.tempAgua) {
                        console.log("Will notify TEMP in "+tubinfo.mac)
                        Notification.mqttNotify(tubinfo.mac, "TEMP")
                    }
                    break
                case TubFeedbacks.FLEVEL:
                    if(value == 2 && value != tubinfo.nivel) {
                        console.log("Will notify LEVEL in "+tubinfo.mac)
                        Notification.mqttNotify(tubinfo.mac, "LEVEL")
                    }
                    break
                default:
                //console.log("******** KEY ERROR! **********")
                //console.log("   >> Key not found: "+key)
                break
            }
        }

    }
}