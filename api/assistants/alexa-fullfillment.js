const express = require('express');
const router = express.Router();

const assistDAO = require('../dao/assistantDAO')

const mqtt_service = require('../mqtt/mqttService')

/* ************************** TEST ************************** */

/**
 * TEST - Tests the CAS platform health
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 * @return {JSON}               Returns a successfull JSON if alright
 */
router.get('/test', (request, response) => {
    console.log("veio pro GET de teste")
    response.status(200).json({ "code": 200, "status": "CAS is UP!" });
});

/* ************************ EVENTS ************************* */

router.post('/discovery', async (request, response) => {
    console.log("veio pro POST de DISCOVER")

    const accessToken = request.body.token
    const email = await assistDAO.getUsermail(accessToken)
    if(!email) response.status(404).json({err: "token_err"})
    const userDevices = await assistDAO.getUserDevices(email)

    response.status(200).json(userDevices)
});

router.post('/command', async (request, response) => {
    console.log("veio pro POST de COMMAND")

    const devID = request.body.endpoint
    const cmd = request.body.command
    const value = request.body.value

    let tub = await assistDAO.getTargetTub(devID)
    // Quick validations
    if(Date.now()-tub.alive>135000) {
        response.status(200).json({err: -1})
        return
    }
    if(tub.infos[0].power == 0) {
        if(cmd == "power") {
            if(value == 0) {
                response.status(200).json({res: 0})
                return
            }
        } else {
            response.status(200).json({err: 2})
            return
        }
    } else {
        if(cmd == "power") {
            if(value == 1) {
                response.status(200).json({res: 0})
                return
            }
        }
        if(tub.infos[0].saidaAquecedor == 0) {
            if(cmd == "tempset") {
                response.status(200).json({err: 4})
                return
            }
        }
        if(tub.infos[0].nivel == 0) {
            if((/^b[0-6]$/.test(cmd) || cmd == "todas") && value != 0) {
                response.status(200).json({err: 1})
                return
            }
        }
        if(tub.infos[0].saidaRGBA == 0) {
            if(cmd.startsWith("spots ")) {
                response.status(200).json({err: 4})
                return
            }
        }
        if(tub.infos[0].saidaauxconf == 0) {
            if(cmd == "agua") {
                response.status(200).json({err: 4})
                return
            }
        }
    }

    let command = `:AL ${tub.pswd1} ${cmd} ${value};`
    mqtt_service.sendCommand(tub.mqtt_sub, command)

    response.status(200).json({res: "1"})
});

router.post('/retrieve', async (request, response) => {
    console.log("veio pro POST de RETRIEVE")

    const devID = request.body.endpoint
    let tubinfo = await assistDAO.getTargetTubInfo(devID)

    response.status(200).json(tubinfo)
});


module.exports = router;
