const Client = require('../models/Client')
const ApiError = require('../models/apiError')

module.exports = {
    
    registerClient(clientName, clientID, clientSecret, usermail, response){
        Client.findOne({ id: clientID }, (err, client) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST CLIENTS 1"))
                return
            }
            
            if (!client) {
                client = new Client({
                    name: clientName,
                    id: clientID,
                    secret: clientSecret,
                    usermail: usermail
                })
            } else {                
                client.name = clientName;
                client.id = clientID;
                client.secret = clientSecret;
                client.usermail = usermail;
            }

            client.save((err) => {
                if (err) {
                    response.status(500).json(new ApiError(err.message, "POST CLIENTS 2"))
                } else {
                    response.status(201).json(new ApiError("Client registered", client));
                }
            })
        })
    },

    getClients(email, response){
        Client.find({usermail: email}, (err, clients) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET CLIENTS 1"))
                return
            }
            response.status(200).json(Client.decryptSecretOf(clients));
        })
    }
}