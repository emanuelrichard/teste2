var oauth2orize = require('oauth2orize')
var User = require('../models/User');
var Client = require('../models/Client');
var Token = require('../models/Token');
var Code = require('../models/Code');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization function
server.serializeClient(function (client, callback) {
    return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient(function (id, callback) {
    Client.findOne({ _id: id }, function (err, client) {
        if (err) { return callback(err); }

        return callback(null, client);
    });
});

// Register authorization code grant type
server.grant(oauth2orize.grant.code({ scopeSeparator: [ ' ', ',' ] },
function (client, redirectUri, user, ares, callback) {

    // Create a new authorization code
    var code = new Code({
        value: uid(16),
        clientId: client._id,
        redirectUri: redirectUri,
        usermail: user.email
    });

    // Save the auth code and check for errors
    code.save(function (err) {
        if (err) { return callback(err); }

        callback(null, code.value);
    });
}));

// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, callback) {
    console.log("GENERATING TOKEN.....")

    Code.findOne({ value: code }, function (err, authCode) {
        if (err) { return callback(err); }

        if (client === undefined || authCode === undefined) { return callback(null, false); }

        if (client._id.toString() !== authCode.clientId) { return callback(null, false); }

        if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

        // Delete auth code now that it has been used
        authCode.remove(function (err) {

            if (err) { return callback(err); }

            // Create a new access token
            var token = new Token({
                value: uid(256),
                refresh: uid(256),
                clientId: authCode.clientId,
                usermail: authCode.usermail
            });

            // Save the access token and check for errors
            token.save(function (err) {
                if (err) { return callback(err); }
                callback(null, token.value, token.refresh, {expires_in: 3600});
            });
        });
    });
}));

server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, callback) {
    console.log("REFRESHING TOKEN.....")

    Token.findOne({refresh: refreshToken }, (err, token) => {
        if (err) { console.log("ERROR!"); return callback(err); }

        if (!token) { console.log("INVALID TOKEN!"); return callback(null, false); }

        token.remove(function (err) {
            if (err) { return callback(err); }

            // Create a new access token
            var newToken = new Token({
                value: uid(256),
                refresh: uid(256),
                clientId: token.clientId,
                usermail: token.usermail
            });

            // Save the access token and check for errors
            newToken.save(function (err) {
                if (err) { return callback(err); }
                callback(null, newToken.value, newToken.refresh, {expires_in: 3600});
            });
        });
    });
}));

// User authorization endpoint
exports.authorization = [
    server.authorization(function (clientId, redirectUri, callback) {
        console.log("OAUTH2 AUTHORIZATION!");
        Client.findOne({ id: clientId }, function (err, client) {
            if (err) { return callback(err); }
            
            return callback(null, client, redirectUri);
        });
    }),

    function (req, res) {
        let clz = ""
        if(req.oauth2.client.name.includes("Google")) clz = "home"
        else if(req.oauth2.client.name.includes("Alexa")) clz = "alexa"
    
        res.render('dialog', { transactionID: req.oauth2.transactionID, 
            scopes: req.oauth2.req.scope, 
            currentURL: encodeURIComponent(req.originalUrl),
            response_type: req.query.response_type,
            user: req.user, 
            client: req.oauth2.client, 
            clazz: clz 
        });
    }
]

// User decision endpoint
exports.decision = [
    server.decision(function(req, done){
        done(null, { scope: req.oauth2.req.scope });
    })
]

// Application client token exchange endpoint
exports.token = [
    server.token(),
    server.errorHandler()
]

// Utility functions to generate unique identifiers
function uid (len) {
    var buf = []
      , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      , charlen = chars.length;
    for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join('');
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }