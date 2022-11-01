const ApiError = require('../models/apiError')
const Tub = require('../models/Tub')

const mqtt_service = require('../mqtt/mqttService')

module.exports = {
    
    addTub(BTid, name, email, pw1, pw2, pw3, pw4, ip, ssid, pub, sub, wifi, mqtt, lat, lng, response) {
        let mac = Tub.getMac(pub)
        Tub.findOne({ mac: mac }, (err, tub) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST TUB 1"))
                return
            }
            if (tub) {  // Tub already registered

                // Check if user already owns the tub
                if(tub.users.some(u => u.email === email)){
                    response.status(400).json(new ApiError("Tub already registered", email))
                    return
                }

                // Check if need to update location
                if(lat && lng) {
                    tub.latitude = lat
                    tub.longitude = lng
                }

                // Update tub infos
                tub.mac = mac,
                tub.BTid = BTid,
                tub.pswd1 = pw1,
                tub.pswd2 = pw2,
                tub.pswd3 = pw3,
                tub.pswd4 = pw4,
                tub.wifi_state = wifi,
                tub.ip = ip,
                tub.ssid = ssid,
                tub.mqtt_state = mqtt,
                tub.mqtt_pub = pub,
                tub.mqtt_sub = sub,
                tub.date = Date.now()

                // Add the new user
                tub.users.push({
                    email: email,
                    tubname: name
                })
                tub.save((err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "POST TUB 2"))
                        return
                    }
                    response.status(200).json(tub)
                })
                return
            }
            
            // No Tub registered, it's a new Tub
            var tub = new Tub({
                mac: mac,
                BTid: BTid,
                users: [{
                    email: email,
                    tubname: name
                    }],
                pswd1: pw1,
                pswd2: pw2,
                pswd3: pw3,
                pswd4: pw4,
                wifi_state: wifi,
                ip: ip,
                ssid: ssid,
                mqtt_state: mqtt,
                mqtt_pub: pub,
                mqtt_sub: sub,
                latitude: lat,
                longitude: lng
            })

            tub.save((err) => {
                if (err) {
                    response.status(500).json(new ApiError(err.message, "POST TUB 3"))
                    return
                }
                mqtt_service.subscribe(tub.mqtt_pub, tub.mqtt_sub)
                    response.status(201).json(tub);
            })
        })
    },

    getAllTubs(response){
        Tub.find({}, (err, tubs) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET ALL TUBS 1"))
                return
            }
            response.status(200).json(tubs);
        })
    },

    getTubs(email, response){
        Tub.find({ "users.email": email }, (err, tubs) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET TUBS/EMAIL 1"))
                return
            }
            response.status(200).json(Tub.serialize(tubs, email));
        })
    },

    updateTub(BTid, name, email, pw1, pw2, pw3, pw4, ip, ssid, wifi, mqtt, response){
        Tub.findOne({ BTid: BTid, "users.email": email }, (err, tub) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "PUT TUB 1"))
                return
            }
            if (tub) {
                tub.mac = Tub.getMac(tub.mqtt_pub)
                tub.pswd1 = pw1
                tub.pswd2 = pw2
                tub.pswd3 = pw3
                tub.pswd4 = pw4
                tub.wifi_state = wifi
                tub.ip = ip
                tub.ssid = ssid
                tub.mqtt_state = mqtt
                let idx = tub.users.findIndex(e => e.email == email)
                let users = [...tub.users]
                users[idx] = {email: email, tubname: name}
                tub.users = users
                tub.date = Date.now()

                tub.save((err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "PUT TUB 2"))
                        return
                    }
                    response.status(200).json(new ApiError("Tub updated", 0));
                })
                return
            }
            response.status(404).json(new ApiError("Tub not found!", BTid));    
        })
    },

    deleteTub(BTid, email, response){

        Tub.findOne({ BTid: BTid, "users.email": email }, (err, tub) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "DELETE TUB 1"))
                return
            }
            if (tub) {
                // Get the tub users
                let idx = tub.users.findIndex(e => e.email == email)
                let users = [...tub.users]
                users.splice(idx, 1)
                tub.users = users

                tub.save((err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "DELETE TUB 2"))
                        return
                    }
                    response.status(200).json(new ApiError("Tub deleted from", email));
                })
                return
            }
            response.status(404).json(new ApiError("Tub not found!", BTid));
            return
        })

        // Tub.deleteOne({ email: email }, (err, doc) => {
        //     if (err) {
        //         response.status(500).json(new ApiError(err.message, "DELETE TUB 1"))
        //         return
        //     }
        //     if (doc.deletedCount == 0) {
        //         response.status(404).json(new ApiError("Tub not found!", id));
        //         return
        //     }
        //     //deleteTubData(mac)
        //     response.status(200).json(new ApiError("Tub removed", 0));
        //     return
        // })
    },

    /* ************************** MQTT ************************** */

    mqttGetSubTopics(callback){
        // Tub.find({},{ projection: {_id: 0, mqtt_pub: 1, mqtt_sub: 1}}).toArray((err, subTopics) => {
        //     if (err) {
        //         console.log(JSON.stringify(new ApiError(err.message, "MQTT TUB 1")))
        //         return
        //     }
        //     callback(subTopics)
        // })
        Tub.find({}, {_id: 0, mqtt_pub: 1, mqtt_sub: 1}, (err, subTopics) => {
            if (err) {
                console.log(JSON.stringify(new ApiError(err.message, "MQTT TUB 1")))
                return
            }
            callback(subTopics)
        })
    },

    mqttUpdateTub(id, tubInfos){
            Tub.findOne({ id_banheira: id }, (err, tub) => {
                if (err) {
                    console.log(JSON.stringify(new ApiError(err.message, "MQTT TUB 2")))
                    return
                }
                if (tub) {

                    var updtub = new Tub(id)
                    updtub.setTubInfo(tubInfo)
                    updtub.setUsers(tub.id_usuario)

                    updateDoc = { $set: updtub }
                    Tub.updateOne({ id_banheira: id }, updateDoc, (err, doc) => {
                        if (err) {
                            console.log(JSON.stringify(new ApiError(err.message, "MQTT TUB 3")))
                            return
                        }
                        console.log(JSON.stringify(new ApiError("Tub updated", 0)))
                    })
                    return
                }
                console.log(JSON.stringify(new ApiError("Tub not found!", id)))
            })
    },

}