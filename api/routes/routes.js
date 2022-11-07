const express = require('express');
const router = express.Router();

const LoginDAO = require('../dao/loginDAO')
const UserDAO = require('../dao/userDAO')
const ClientDAO = require('../dao/clientDAO')
const OAuth2DAO = require('../dao/OAuth2DAO');
const TubDAO = require('../dao/tubDAO')
const TubInfoDAO = require('../dao/tubInfoDAO')

const Auth = require('../middleware/auth')
const checkAuth = Auth.isAuthenticated
const checkClientAuth = Auth.isClientAuthenticated

/* ************************** TEST ************************** */

/**
 * TEST - Tests the CAS platform health
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 * @return {JSON}               Returns a successfull JSON if alright
 */
router.get('/test', (request, response) => {
    console.log("veio pro GET de teste")
    response.status(200).json({ "code": 200, "status": "Blue is UP!" });
});

/* ************************* LOGIN ************************* */

/**
 * LOGIN - Perform the login to the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/login', checkAuth, (request, response) => {
    console.log("veio pro POST de LOGIN")

    let email = request.user.email;
    LoginDAO.loginUser(email, response)
});

/**
 * CHECK LOGIN - Check if a given login is valid
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/checklogin', checkAuth, (request, response) => {
    console.log("veio pro POST de CHECKLOGIN")

    let email = request.user.email;
    let code = request.body.code;
    LoginDAO.checkLogin(email, code, response)
});

/**
 * LIST LOGINS - Lists all the current logins in the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/login/0630', (request, response) => {
    console.log("veio pro GET de LOGIN")
    LoginDAO.getActiveLogins(response)
});

/**
 * LOGOUT - Logout a given user from the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.delete('/login', checkAuth, (request, response) => {
    console.log("veio pro DELETE de LOGIN")

    email = request.user.email
    LoginDAO.logoutUser(email, response)
});

/* ************************** USER ************************** */

/**
 * REGISTER USER - Register a new user to the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/user', (request, response) => {
    console.log("veio pro POST de USER")

    let name = request.body.name
    let email = request.body.email
    let os = request.body.os
    UserDAO.registerUser(name, email, os, response)
});

/**
 * RENEW USER PASS - Provide new user password to the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/user/forgot', (request, response) => {
    console.log("veio pro GET de USER/FORGOT")

    let email = request.body.email
    UserDAO.requestNewPassword(email, response)
})

/**
 * LIST USER - Load an user info registered in the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/user', checkAuth, (request, response) => {
    console.log("veio pro GET de USER")

    const email = request.user.email;
    UserDAO.getUser(email, response)
});

/**
 * LIST ALL USER - List all user infos inside the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/user/0630', (request, response) => {
    console.log("veio pro GET de ALL USER")

    UserDAO.getUsers(response)
});

/**
 * UPDATE USER - Update a given user infos inside the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.put('/user', checkAuth, (request, response) => {
    console.log("veio pro PUT de USER")

    const email = request.user.email;
    const name = request.body.newname;
    const new_pswd = request.body.newpassword;
    const os = request.body.os
    UserDAO.updateUser(email, name, new_pswd, os, response)
});

/**
 * DELETE USER - Delete a given user from the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.delete('/user', checkAuth, (request, response) => {
    console.log("veio pro DELETE de USER")

    const email = request.user.email;
    UserDAO.deleteUser(email, response)
});

/* ************************ CLIENTS ************************ */

/**
 * REGISTER CLIENT - Register a new client for an user int the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/client', checkAuth, (request, response) => {
    console.log("veio pro POST de CLIENT")

    let clientName = request.body.name
    let clientID = request.body.cid
    let clientSecret = request.body.secret
    let email = request.user.email
    ClientDAO.registerClient(clientName, clientID, clientSecret, email, response)
});

/**
 * LIST USER CLIENTS - Load clients connected to an user account in the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/client', checkAuth, (request, response) => {
    console.log("veio pro GET de CLIENT")

    const email = request.user.email;
    ClientDAO.getClients(email, response)
});

/* ************************ OAUTH2 ************************ */

router.get('/oauth2/authorize',
    checkAuth,
    OAuth2DAO.authorization);

router.post('/oauth2/authorize',
    checkAuth,
    OAuth2DAO.decision);

router.post('/oauth2/token',
    checkClientAuth,
    OAuth2DAO.token);

/* ************************ TUBS ************************ */
/**
 * ADD TUB - Add a tub to an user account
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/tubs', checkAuth, (request, response) => {
    console.log("veio pro POST de TUB")
    const BTid = request.body.BTid
    const name = request.body.tubname
    const email = request.user.email
    const pw1 = request.body.pswd1
    const pw2 = request.body.pswd2
    const pw3 = request.body.pswd3
    const pw4 = request.body.pswd4
    const ip = request.body.ip
    const ssid = request.body.ssid
    const pub = request.body.mqtt_pub
    const sub = request.body.mqtt_sub
    const wifi = request.body.wifi_state
    const mqtt = request.body.mqtt_state
    const lat = request.body.latitude
    const lng = request.body.longitude

    TubDAO.addTub(BTid, name, email, pw1, pw2, pw3, pw4, ip, ssid, pub, sub, wifi, mqtt, lat, lng, response)
})

/**
 * LOAD ALL TUBS - Load all the tubs
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/tubs/0630', (request, response) => {
    console.log("veio pro GET de ALLTUBS")
    TubDAO.getAllTubs(response)
})

/**
 * LOAD TUBS - Load the user tubs
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/tubs', checkAuth, (request, response) => {
    console.log("veio pro GET de TUB")

    const email = request.user.email;
    TubDAO.getTubs(email, response)
})

/**
 * UPDATE Tub - Update the given Tub infos inside the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.put('/tubs', checkAuth, (request, response) => {
    console.log("veio pro PUT de TUB")

    const BTid = request.body.BTid
    const name = request.body.tubname
    const email = request.user.email;
    const pw1 = request.body.pswd1
    const pw2 = request.body.pswd2
    const pw3 = request.body.pswd3
    const pw4 = request.body.pswd4
    const ip = request.body.ip
    const ssid = request.body.ssid
    const wifi = request.body.wifi_state
    const mqtt = request.body.mqtt_state
    TubDAO.updateTub(BTid, name, email, pw1, pw2, pw3, pw4, ip, ssid, wifi, mqtt, response)
});

/**
 * DELETE TUB - Delete a tub from the user account
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.delete('/tubs', checkAuth, (request, response) => {
    console.log("veio pro DELETE de TUB")

    const email = request.user.email;
    const BTid = request.body.BTid
    TubDAO.deleteTub(BTid, email, response)
})

/* ************************ TUBINFO ************************ */
/**
 * ADD TUBINFO - Add infos about a tub
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/tubinfo', checkAuth, (request, response) => {
    console.log("veio pro POST de TUBINFO")
    const BTid = request.body.BTid
    const pw1 = request.body.pswd1
    const pw2 = request.body.pswd2
    const pw3 = request.body.pswd3
    const pw4 = request.body.pswd4
    const fw = request.body.fw
    const v = request.body.v
    const qtBombs = request.body.qtBombs
    const b2Cfg = request.body.b2Cfg
    const hTemp = request.body.hTemp
    const autoOn = request.body.autoOn
    const hWarmer = request.body.hWarmer
    const hRGBA = request.body.hRGBA
    const tOffset = request.body.tOffset
    const tN1 = request.body.tN1
    const tN2 = request.body.tN2
    const agDays = request.body.agDays
    const agHour = request.body.agHour
    const agMin = request.body.agMin
    const agTime = request.body.agTime
    const wifi = request.body.wifi_state
    const ssid = request.body.ssid
    const pswd = request.body.pswd
    const ip = request.body.ip
    const mqtt = request.body.mqtt_state
    const pub = request.body.mqtt_pub
    const sub = request.body.mqtt_sub
    const bklight = request.body.bklight
    const power = request.body.power
    const wTemp = request.body.wTemp
    const sTemp = request.body.sTemp
    const warmer = request.body.warmer
    const b1 = request.body.b1
    const b2 = request.body.b2
    const b3 = request.body.b3
    const b4 = request.body.b4
    const lvl = request.body.lvl
    const nSpots = request.body.nSpots
    const nStrip = request.body.nStrip
    const spotState = request.body.spotState
    const spotStatic = request.body.spotStatic
    const spotSpeed = request.body.spotSpeed
    const spotBright = request.body.spotBright
    const spotsCMode = request.body.spotsCMode
    const stripState = request.body.stripState
    const stripStatic = request.body.stripStatic
    const stripSpeed = request.body.stripSpeed
    const stripBright = request.body.stripBright
    const stripCMode = request.body.stripCMode

    TubInfoDAO.saveTubInfo(BTid, pw1, pw2, pw3, pw4, fw, v, qtBombs, b2Cfg, 
        hTemp, autoOn, hWarmer, hRGBA, tOffset, tN1, tN2, agDays, agHour, agMin,
        agTime, wifi, ssid, pswd,ip, mqtt, pub, sub, bklight, power, wTemp, sTemp,
        warmer, b1, b2, b3, b4, lvl, nSpots, nStrip, spotState, spotStatic, spotSpeed,
        spotBright, spotsCMode, stripState, stripStatic, stripSpeed, stripBright,
        stripCMode, response)
})


module.exports = router;
