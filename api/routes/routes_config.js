const express = require('express');
const router = express.Router();

const InstallerDAO = require('../dao_config/installerDAO')
const InstallationDAO = require('../dao_config/installationDAO')

const Auth = require('../middleware/auth')
const checkAuth = Auth.isInstallerAuthenticated

/* ************************** TEST ************************** */

/**
 * TEST - Tests the CAS platform health
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 * @return {JSON}               Returns a successfull JSON if alright
 */
router.get('/test', (request, response) => {
    console.log("veio pro GET de teste")
    response.status(200).json({ "code": 200, "status": "BlueEasy is UP!" });
});

/* ************************ INSTALLER ************************* */

/**
 * REGISTER INSTALLER - Register a new installer to the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/installer', (request, response) => {
    console.log("veio pro POST de INSTALLER")

    let name = request.body.name
    let identity = request.body.identity
    let company = request.body.company
    let email = request.body.email
    let phone = request.body.phone
    InstallerDAO.registerInstaller(name, identity, company, email, phone, response)
});

/**
 * LIST INSTALLER - Load an installer info registered in the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/installer', checkAuth, (request, response) => {
    console.log("veio pro GET de INSTALLER")

    const code = request.user.code;
    InstallerDAO.getInstaller(code, response)
});

/**
 * UPDATE INSTALLER - Update a given installer infos inside the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.put('/installer', checkAuth, (request, response) => {
    console.log("veio pro PUT de INSTALLER")

    let code = request.user.code
    let new_email = request.body.email
    let new_name = request.body.name
    let new_company = request.body.company
    let new_code = request.body.code
    let new_phone = request.body.phone
    InstallerDAO.updateInstaller(code, new_email, new_name, new_company, new_code, new_phone, response)
});

/**
 * DELETE INSTALLER - Delete a given installer from the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.delete('/installer', checkAuth, (request, response) => {
    console.log("veio pro DELETE de INSTALLER")

    const code = request.user.code;
    InstallerDAO.deleteInstaller(code, response)
});

/* ********************** INSTALLATION ************************ */

/**
 * REGISTER INSTALLATION - Register a new installation to the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/installation', checkAuth, (request, response) => {
    console.log("veio pro POST de INSTALLATION")

    let installer_id = request.user.code
    let installer_name = request.body.installer
    let tub_serial = request.body.tubserial
    let tub_id = request.body.tubid
    let tub_owner = request.body.owner
    let tub_phone = request.body.phone
    let tub_addr = request.body.address
    let tub_lat = request.body.latitude
    let tub_lng = request.body.longitude
    let idate = request.body.date
    InstallationDAO.saveInstallation(installer_id, installer_name, tub_serial, tub_id, tub_owner, tub_phone,
        tub_addr, tub_lat, tub_lng, idate, response)
});

/**
 * LIST INSTALLATION - Load an installation info registered in the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.get('/installation', checkAuth, (request, response) => {
    console.log("veio pro GET de INSTALLATION")

    const tub_serial = request.query.serial;
    InstallationDAO.getInstallation(tub_serial, response)
});

/**
 * UPDATE INSTALLATION - Update a given installation infos inside the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.put('/installation', checkAuth, (request, response) => {
    console.log("veio pro PUT de INSTALLATION")

    let tub_serial = request.body.tubserial
    let tub_owner = request.body.owner
    let tub_phone = request.body.phone
    let tub_addr = request.body.address
    let tub_lat = request.body.latitude
    let tub_lng = request.body.longitude
    InstallationDAO.updateInstallation(tub_serial, tub_owner, tub_phone,
        tub_addr, tub_lat, tub_lng, response)
});

/**
 * DELETE INSTALLATION - Delete a given installation from the CAS platform
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.delete('/installation', checkAuth, (request, response) => {
    console.log("veio pro DELETE de INSTALLATION")

    let tub_serial = request.body.tubserial;
    InstallationDAO.deleteInstallation(tub_serial, response)
});

module.exports = router;
