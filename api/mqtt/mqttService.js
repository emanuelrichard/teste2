const mqtt = require('../mqtt/mqtt')

//const Command = require('../models/Command')
//const CommandDAO = require('../dao/commandDAO')

const MQTT_FBK = "status"
const MQTT_CMD = "comando"

var mqtt_client

module.exports = {

    initialize() {
        mqtt_client = mqtt.connect()

        // Connection callback
        mqtt_client.on('connect', () => {
            console.log(`MQTT client connected`);

            subscribeAll()
        });

        // Disconnection callback
        mqtt_client.on('close', () => {
            console.log(`mqtt client disconnected`);
        });

        // MQTT error callback
        mqtt_client.on('error', (err) => {
            console.log(err);
            mqtt_client.end();  
        });

        // New message callback
        mqtt_client.on('message', (topic, message) => {
            let t_info = topic.split("_")
            let id = t_info[0]
            let type = t_info[1]
            let msg = message.toString().split("\\n").join("\n")

            if(type == MQTT_FBK) {
                //deleteCommands(id, msg)
                updateTubInfo(id, msg)
                return
            }

            if(type == MQTT_CMD) {
               //saveCommands(id, msg)
               return 
            } 
        });
    },

    sendCommand(id, command) {
        console.log("Sending command "+command+" to: "+id)
        mqtt_client.publish(id, command)
    },

    subscribe(pub, sub) {
        console.log("Subscribing to: "+pub+" and "+sub)
        mqtt_client.subscribe(pub, {qos: 0});
        mqtt_client.subscribe(sub, {qos: 0});
    }


}

function saveCommands(id, commands) {
    // Save commands
    parsed = Command.parseCommands(commands)
    for(i in parsed) {
        CommandDAO.saveCommand(parsed[i].key, parsed[i].value, id)
    }
}

function deleteCommands(id, tubinfo) {

    // Callback to be called after command removal
    let callback = () => {

        let callback1 = (cmds) => {
            // commands to re-send
            for(i in cmds){
                let cmd = ":" + cmds[i].key + " " + cmds[i].value + ";"
                console.log("Resending ¨"+ cmd +"¨ on topic ¨"+ id + "_comando¨")
                mqtt_client.publish(id+"_comando", cmd)
            }
        }
        CommandDAO.getCommands(id, callback1)
    
    
        let TubDAO = require('../dao/tubDAO')
        TubDAO.mqttUpdateTub(id, tubinfo)

    }
   
    // Parse the feedback to get the command key value pair
    parsed = Command.parseCommands(tubinfo)
    for(i in parsed) {
        // Delete the command if exists
        CommandDAO.deleteCommand(parsed[i].key, parsed[i].value, id, callback) // ISSUE: MULTIPLE CALLS
    }
}

function updateTubInfo(mac, feedback) {
    let TubInfoDAO = require('../dao/tubInfoDAO')
    TubInfoDAO.saveMQTTTubInfo(mac, feedback)
}

function subscribeAll() {

    let callback = (subtopic) => {
        // mqtt subscriptions
        for(ids in subtopic){
            if(!!subtopic[ids].mqtt_pub || !!subtopic[ids].mqtt_sub){
                console.log("Subscribing to: "+subtopic[ids].mqtt_pub)
                mqtt_client.subscribe(subtopic[ids].mqtt_pub, {qos: 0});
                console.log("Subscribing to: "+subtopic[ids].mqtt_sub)
                mqtt_client.subscribe(subtopic[ids].mqtt_sub, {qos: 0});
            } else {
                console.log("Sem tópicos para sobrescrever!")
            }
        }
    }

    // Get the tubs topics to subscribe
    let TubDAO = require('../dao/tubDAO')
    TubDAO.mqttGetSubTopics(callback)
}