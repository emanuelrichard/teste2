//Install express server
const express = require('express');
const app = express();

const http = require('http').createServer(app)
const https = require('https');
const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');

const Auth = require('./api/middleware/auth')
const checkAuth = Auth.isAuthenticated

// Connect DB
//const db_uri = "mongodb://localhost:27017/cas_tubs";
const db_uri = "mongodb+srv://teste:teste@cluster0.xbm1w5k.mongodb.net/test"; // Encrypted
mongoose.connect(db_uri,{ useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true }, function(err, client) {

    // Connection unsuccessful
    if (err){
        console.log(err);
        process.exit(0)
    }

    // Mongoose Schemas initialization
    require('./api/models/User');
    require('./api/models/Tub');
    require('./api/models/TubInfo');
    require('./api/models/Login');
    require('./api/models/Code');
    require('./api/models/Token');
    require('./api/models/Client');
    require('./api/models/Installer');
    require('./api/models/Installation');

    // MQTT initialization
    let mqttService = require('./api/mqtt/mqttService')
    mqttService.initialize()

    // Setup CORS policy
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();
    });

    // Setup body-parser to access req. body
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Use the passport package in our application
    app.use(passport.initialize());

    // Use express session support since OAuth2orize requires it
    app.use(session({
        secret: 'Super Secret Session Key',
        saveUninitialized: true,
        resave: true
    }));

    // Setup app routes
    app.use('/api/', require('./api/routes/routes'))
    app.use('/api/casctrl', require('./api/routes/routes_config'))
    app.use('/api/message', require('./api/routes/routes_notify'))

    // Amazon Alexa route
    app.use('/amzalx/', require('./api/assistants/alexa-fullfillment'))

    // Google Actions route
    app.post('/fulfillment', checkAuth, require('./api/assistants/googleHome-fulfillment'))

    // Set view engine to ejs
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, './api/view'));
    app.use('/public1', express.static(__dirname + '/api/view'));

    // Serve only the static files from the static directory
    app.use('/public', express.static(__dirname + '/static'));

    app.get('/docs/privacy-policy', function (req, res) {
        res.sendFile(path.join(__dirname + '/static/privacy-policy.html'));
    });

    // Setup for HTTPS
 //   const optionsHttps = {
 //       key: fs.readFileSync('ssl/privkey.pem', 'utf8'),
  //      cert: fs.readFileSync('ssl/fullchain.pem', 'utf8'),
  //      rejectUnauthorized: false,
  //      requestCert: false
  //  };

    //Start the app using HTTPS options on the 8090 port
 //   https.createServer(optionsHttps, app).listen(8090, function () {
 //       console.log("HTTPS server started at port 8090");
  //  });
  

    // Start the app by listening on the default port or the 8090 one
     http.listen(process.env.PORT || 8090, () => {
         console.log("Server running on port 8090");
     })
});