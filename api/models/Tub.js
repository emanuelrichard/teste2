var mongoose = require('mongoose');

var TubSchema = new mongoose.Schema({
    mac: {
        type: String,
        unique: true,
        required: true
    },
    BTid: {
        type: String,
        required: true
    },
    users: {
        type: [{
            _id: false,
            email: {
                type: String
            },
            tubname: {
                type: String
             }
        }]
    },
    pswd1: {
        type: String,
        required: true
    },
    pswd2: {
        type: String,
    },
    pswd3: {
        type: String,
    },
    pswd4: {
        type: String,
    },
    wifi_state: {
        type: String,
        required: true
    },
    ip: {
        type: String,
    },
    ssid: {
        type: String,
    },
    mqtt_state: {
        type: String,
        required: true
    },
    mqtt_pub: {
        type: String
    },
    mqtt_sub: {
        type: String
    },
    latitude: {
        type: String,
        //required: true
    },
    longitude: {
        type: String,
        //required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    alive: {
        type: Number,
        default: 0
    }
});

// Decrypt the password to send in response
TubSchema.statics.serialize = function (data, email) {
    return data.map(function (tub) {
        let serialized = {
            BTid: tub.BTid,
            tubname: tub.users.find(u => u.email == email).tubname,
            pswd1: tub.pswd1,
            pswd2: tub.pswd2,
            pswd3: tub.pswd3,
            pswd4: tub.pswd4,
            ip: tub.ip,
            ssid: tub.ssid,
            mqtt_pub: tub.mqtt_pub,
            mqtt_sub: tub.mqtt_sub,
            wifi_state: tub.wifi_state,
            mqtt_state: tub.mqtt_state,
            latitude: tub.latitude,
            longitude: tub.longitude,
            alive: (Date.now()-tub.alive < 125000),
            date: tub.date
        }

        if(tub.hasOwnProperty("infos"))
            serialized["infos"] = tub.infos[0]

        return serialized
    })
}

// Decrypt the password to send in response
TubSchema.statics.getMac = function (pub) {
    return pub.split("_")[0]
}

module.exports = mongoose.model('Tub', TubSchema);