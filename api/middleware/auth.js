var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../models/User')
const Client = require('../models/Client')
const Installer = require('../models/Installer')
const Token = require('../models/Token')

passport.use(new BasicStrategy(
  function (email, password, callback) {
    console.log("[BASIC] EMAIL: " + email)
    User.findOne({ email: email }, (err, user) => {
      if (err) { console.log("ERROR!"); return callback(err) }

      // No user found with that email
      if (!user) { console.log("NO USER!"); return callback(null, false) }

      // Make sure the password is correct
      user.checkPassword(password, function (err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { // Test the temp password
          if (!password || user.temp_pswd != password) {
            return callback(null, false);
          }
        }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use(new BearerStrategy(
  function (accessToken, callback) {

    Token.findOne({ value: accessToken }, (err, token) => {
      if (err) { console.log("ERROR!"); return callback(err); }

      // No token found
      if (!token) { console.log("NO TOKEN!"); return callback(null, false); }

      User.findOne({ email: token.usermail }, (err, user) => {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        console.log("[BEARER] EMAIL: " + user.email)
        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
//exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

passport.use('client-basic', new BasicStrategy(
  function (username, password, callback) {
    console.log("[CLIENT] CLIENT ID: " + username)
    Client.findOne({ id: username }, (err, client) => {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { console.log("NO CLIENT/WRONG SECRET!"); return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });

passport.use('installer-basic', new BasicStrategy(
  function (code, password, callback) {
    console.log("[INSTALLER] ID: " + code)
    Installer.findOne({ code: code }, (err, installer) => {
      if (err) { return callback(err); }

      // No installer found with that id or bad password
      if (!installer || password != "Config.CAS") { console.log("NO INSTALLER/WRONG SECRET!"); return callback(null, false); }

      // Success
      return callback(null, installer);
    });
  }
));

exports.isInstallerAuthenticated = passport.authenticate('installer-basic', { session: false });