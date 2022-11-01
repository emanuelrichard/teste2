const Installation = require('../models/Installation')
const ApiError = require('../models/apiError')

module.exports = {
    
    saveInstallation(installer_id, installer_name, tub_serial, tub_id ,tub_owner, tub_phone,
    tub_addr, tub_lat, tub_lng, idate, response) {
        Installation.findOne({ tub_serial: tub_serial }, async (err, installation) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST INSTALLATION 1"))
                return
            }

            if (installation) {
                response.status(400).json(new ApiError("Installation form already sent", installation.code))
                return
            }

            installation = new Installation({
                installer_id: installer_id,
                installer_name: installer_name,
                tub_serial: tub_serial,
                tub_id: tub_id,
                tubowner_name: tub_owner,
                tubowner_phone: tub_phone,
                tubowner_addr: tub_addr,
                tubowner_lat: tub_lat,
                tubowner_lng: tub_lng
            })
            if(idate) installation.date = idate

            installation.save((err) => {
                if (err) {
                    response.status(500).json(new ApiError(err.message, "POST INSTALLATION 2"))
                } else {
                    response.status(200).json(new ApiError("Installation registered", installation));
                }
            })
        })
    },

    getInstallation(tub_serial, response) {
        Installation.findOne({ tub_serial: tub_serial }, (err, installation) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET INSTALLATION:SERIAL 1"))
                return
            }
            if (!installation) {
                response.status(404).json(new ApiError("Installation not found!", installation))
                return
            }
            response.status(200).json(installation)
        })
    },

    getInstallationByInstaller(installer_id, response){
        Installation.find({ installer_id: installer_id }, (err, installations) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET INSTALLATION:INST 1"))
                return
            }
            if (!installations) {
                response.status(404).json(new ApiError("Installations not found!", installations))
                return
            }
            response.status(200).json(installations)
        })
    },

    updateInstallation(tub_serial, tub_owner, tub_phone,
        tub_addr, tub_lat, tub_lng, response) {

        Installation.findOne({ tub_serial: tub_serial }, (err, installation) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "PUT INSTALLATION:SERIAL 1"))
                return
            }
            if (!installation) {
                response.status(404).json(new ApiError("Installation not found!", email))
                return
            }

            if(tub_serial != undefined) installation.tub_serial = tub_serial
            if(tub_owner != undefined) installation.tub_owner = tub_owner
            if(tub_phone != undefined) installation.tub_phone = tub_phone
            if(tub_addr != undefined) installation.tub_addr = tub_addr
            if(tub_lat != undefined) installation.tub_lat = tub_lat
            if(tub_lng != undefined) installation.tub_lng = tub_lng

            installation.save((err) => {
                if(err) {
                    response.status(500).json(new ApiError(err.message, "PUT INSTALLATION:SERIAL 2"))
                    return
                }
                response.status(200).json(new ApiError("Installation updated", 1));
            })       
        })
    },

    deleteInstallation(tub_serial, response) {
        Installation.deleteOne({ tub_serial: tub_serial }, function (err) {
            if (err) {
                response.status(500).json(new ApiError(err.message, "DELETE INSTALLATION 1"))
                return
            }
            
            response.status(200).json(new ApiError("Installation deleted", 0));
        });
    }

}