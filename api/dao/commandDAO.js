// const Command = require('../models/Command')
// const ApiError = require('../models/apiError')
// const mongodb = require('../database/mongodb')
// const db = mongodb.getDb()

// let COMMANDS_COLLECTION = "commands";

// module.exports = {

//     saveCommand(key, value, tub_id) {
//         db.collection(COMMANDS_COLLECTION).findOne({ tub_id: tub_id, key: key, value: value }, (err, cmd) => {
//             if (err) {
//                 console.log(JSON.stringify(new ApiError(err.message, "SAVE COMM 1")))
//                 return
//             }
//             if (cmd) {
//                 console.log(JSON.stringify(new ApiError("Command already registered", cmd.key+": "+cmd.value)))
//                 return
//             }
            
//             var command = new Command(key, value, tub_id)
//             db.collection(COMMANDS_COLLECTION).insertOne(command, function (err, newcmd) {
//                 if (err) {
//                     console.log(JSON.stringify(new ApiError(err.message, "SAVE COMM 2")))
//                     return
//                 }
//                 console.log(JSON.stringify(new ApiError("Command saved successfully", key+": "+value)))
//                 return
//             })
//         })
//     },

//     getCommands(tub_id, callback) {
//         db.collection(COMMANDS_COLLECTION).find({tub_id: tub_id}).toArray((err, tubs) => {
//             if (err) {
//                 console.log(JSON.stringify(new ApiError(err.message, "GET COMM 1")))
//             }
//             callback(tubs);
//         })
//     },

//     deleteCommand(key, value, tub_id) {
//         db.collection(COMMANDS_COLLECTION).deleteOne({ tub_id: tub_id, key: key, value: value }, function (err, delcmd) {
//             if(err) {
//                 console.log(JSON.stringify(new ApiError(err.message, "DELETE COMM 1")))
//             }
//             console.log(JSON.stringify(new ApiError("Command deleted successfully", key+": "+value)))
//         })
//     }

// }