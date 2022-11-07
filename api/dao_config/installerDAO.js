const Installer = require('../models/Installer')
const ApiError = require('../models/apiError')

const MailInfo = require('../utils/MailInfo')
const Mailer = require('../email/mailer')

module.exports = {
    
    registerInstaller(name, identity, company, email, phone, response) {
        Installer.findOne({ identity: identity }, async (err, installer) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST INSTALLER 1"))
                return
            }

            if (installer) {
                response.status(400).json(new ApiError("Installer already registered!", installer.code))
                return
            }

            installer = new Installer({
                name: name,
                identity: identity,
                code: Installer.genInstallerCode(name),
                email: email,
                phone: phone
            })
            if(company) installer.company_id = company

            let sent = await Mailer.sendEmail(email, MailInfo.WELCOME_CODE(installer.name, installer.code))
            if(sent) {
                installer.save((err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "POST INSTALLER 2"))
                    } else {
                        response.status(200).json(new ApiError("Code Mail Sent", installer));
                    }
                })
            } else {
                response.status(400).json(new ApiError("E-mail not sent", installer.email));
            }
        })
    },

    getInstaller(code, response) {
        Installer.findOne({ code: code }, (err, installer) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET INSTALLER:CODE 1"))
                return
            }
            if (!installer) {
                response.status(404).json(new ApiError("Installer not found!", installer))
                return
            }
            response.status(200).json(installer)
        })
    },

    updateInstaller(code, new_email, new_name, new_company, new_code, new_phone, response) {

        Installer.findOne({ code: code }, (err, installer) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "PUT INSTALLER:EMAIL 1"))
                return
            }
            if (!installer) {
                response.status(404).json(new ApiError("Installer not found!", email))
                return
            }

            if(new_email != undefined) installer.email = new_email
            if(new_name != undefined) installer.name = new_name
            if(new_company != undefined) installer.company_id = new_company
            if(new_code != undefined) installer.code = new_code
            if(new_phone != undefined) installer.phone = new_phone

            installer.save((err) => {
                if(err) {
                    response.status(500).json(new ApiError(err.message, "PUT INSTALLER:EMAIL 2"))
                    return
                }
                response.status(200).json(new ApiError("Installer updated", 1));
            })       
        })
    },

    deleteInstaller(code, response){
        Installer.deleteOne({ code: code }, function (err) {
            if (err) {
                response.status(500).json(new ApiError(err.message, "DELETE INSTALLER 1"))
                return
            }
            
            response.status(200).json(new ApiError("Installer deleted", 0));
        });
    }

}