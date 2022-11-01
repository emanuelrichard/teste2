const User = require('../models/User')
const Login = require('../models/Login')
const ApiError = require('../models/apiError')

const MailInfo = require('../utils/MailInfo')
const Mailer = require('../email/mailer')
const PswdGen = require('../utils/PswdGen')

const LoginDAO = require('../dao/loginDAO')

module.exports = {
    
    registerUser(name, email, os, response){
        User.findOne({ email: email }, async (err, user) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST USERS 1"))
                return
            }

            var pswd = PswdGen.gPswd()
            if (user) {
                if(!user.temp_pswd) {
                    response.status(400).json(new ApiError("Email already registered!", email))
                    return
                }
                user.temp_pswd = pswd.join('')
                user.os = os
            } else {
                user = new User({
                    name: name,
                    email: email,
                    temp_pswd: pswd.join(''),
                    os: os
                })
            }

            user.save(async (err) => {
                if (err) {
                    response.status(500).json(new ApiError(err.message, "POST USERS 2"))
                    return
                }
                let sent = await Mailer.sendEmail(user.email, MailInfo.WELCOME_PASS(user.name, pswd))

                if(sent) {
                    response.status(200).json(new ApiError("Password Mail Sent", user.email));
                } else {
                    response.status(400).json(new ApiError("E-mail not sent", user.email));
                }
            })
        })
    },

    requestNewPassword(email, response) {
        User.findOne({ email: email }, async (err, user) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST USERS 1"))
                return
            }

            var pswd = PswdGen.gPswd()
            if (!user) {
                response.status(404).json(new ApiError("User not found!", email))
                return
            }
            user.temp_pswd = pswd.join('')

            let sent = await Mailer.sendEmail(user.email, MailInfo.RENEW_PASS(user.name, pswd))
            if(sent) {
                user.save((err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "POST USERS 2"))
                    } else {
                        response.status(200).json(new ApiError("Password Mail Sent", user.email));
                    }
                })
            } else {
                response.status(400).json(new ApiError("E-mail not sent", user.email));
            }
        })
    },

    getUsers(response){
        User.find({}, (err, users) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET USERS 1"))
                return
            }
            response.status(200).json(users);
        })
    },

    getUser(email, response){
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET USER:EMAIL 1"))
                return
            }
            if (!user) {
                response.status(404).json(new ApiError("User not found!", email))
                return
            }
            response.status(200).json(user)
        })
    },

    updateUser(email, new_name, new_pswd, new_os, response) {

        User.findOne({ email: email }, (err, user) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "PUT USER:EMAIL 1"))
                return
            }
            if (!user) {
                response.status(404).json(new ApiError("User not found!", email))
                return
            }

            if(new_name) {
                const loginQuery = Login.updateOne(
                    { email: email},
                    { $set: { name: new_name } }
                )
                loginQuery.exec() 
            }

            if(new_name != undefined) user.name = new_name
            if(new_pswd != undefined) user.password = new_pswd
            if(new_os != undefined) user.os = new_os
            user.save((err) => {
                if(err) {
                    response.status(500).json(new ApiError(err.message, "PUT USER:EMAIL 2"))
                    return
                }
                response.status(200).json(new ApiError("User updated", 1));
            })       
        })
    },

    deleteUser(email, response){
        User.deleteOne({ email: email }, function (err) {
            if (err) {
                response.status(500).json(new ApiError(err.message, "DELETE USER 1"))
                return
            }
            
            LoginDAO._logout(email)
            response.status(200).json(new ApiError("User deleted", 0));
        });
    }

}