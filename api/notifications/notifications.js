const admin = require('../firebase/firebase-config')

module.exports = {

    notify(token, title, body, image, response) {
        let message = getNotificationMessage(undefined, title, body, image)
        notifySingle(token, message, response)        
    },

    notifyTopic(topic, title, body, image, response) {
        let message = getNotificationMessage(topic, title, body, image)
        notifyTopic(message, response)
    },

    mqttNotify(topic, about) {
        let message = getDataMessage(topic, about)
        notifyTopic(message)
    }

}

function getDataMessage(topic, about) {
    if(topic) {
        return {
            "topic": topic,
            "data": {
                about: about,
                mac: topic
            },
            "android": {
                priority: "high",
                ttl: 300000 // 5min
            },
            // "apns": {  // DOESN'T WORK AS EXPECTED
            //     headers:{
            //         "apns-expiration": (Math.round((Date.now()/1000))+(300)).toString() // 5min
            //     }
            // },
        }
    }

    return {
        "data": {
            about: about,
            mac: topic
        }
    }
}

function getNotificationMessage(topic, title, body, image) {
    if(topic) {
        return {
            "topic": topic,
            "notification": {
                "title": title,
                "body": body,
                "image": image
            },
            "android": {
                priority: "high",
                ttl: 86400000 //24h
            },
            "apns": {
                headers:{
                    "apns-expiration": (Math.round((Date.now()/1000))+(86400)).toString() //24h
                }
            },
        }
    }

    return {
        "notification": {
            "title": title,
            "body": body,
            "image": image
        }
    }
}

function notifySingle(token, message, res) {

    let options = {
        priority: "high",
        mutableContent: true,
        contentAvailable: true,
        timeToLive: 60 * 60 * 24
    };
    
    admin.messaging().sendToDevice(token, message, options)
    .then( response => {
        if(res) res.status(200).send("Notification sent successfully")
    }).catch( error => {
        console.log('Error sending message:', error);
        if(res) res.status(500).send("Notification issue")
    });
}

function notifyTopic(message, res) {
    admin.messaging().send(message)
    .then((response) => {
        if(res) res.status(200).send("Notification sent successfully")
    })
    .catch((error) => {
        console.log('Error sending message:', error);
        if(res) res.status(500).send("Notification issue")
    });
}