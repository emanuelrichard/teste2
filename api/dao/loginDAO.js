const Login = require('../models/Login')
const User = require('../models/User')
const ApiError = require('../models/apiError')

module.exports = {

    loginUser(email, response) {
        Login.findOne({ email: email }, async (err, login) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST LOGINS 2"))
                return
            }
            if (login) {
                login.code = Login.generateCode(6)
                login.date = Date.now()
                
                login.save((err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "POST LOGINS 3"))
                        return
                    }

                    response.status(200).json(login);
                    return
                })
            } else {
                const userQuery = User.findOne({ email: email });
                let user = await userQuery.exec()

                var newLogin = new Login({
                    email: email,
                    name: user.name,
                    code: Login.generateCode(6)
                })
                newLogin.save(async (err) => {
                    if (err) {
                        response.status(500).json(new ApiError(err.message, "POST LOGINS 4"))
                        return
                    }

                    response.status(201).json(newLogin);
                    return
                })
            }
        })
    },

    checkLogin(email, code, response) {
        Login.findOne({ email: email }, (err, login) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "POST LOGIN 1"))
                return
            }
            if (login) {
                if (login.code == code) {
                    response.status(200).json(new ApiError("Authorized", 200));
                    return;
                }
            }
            response.status(401).json(new ApiError("Not authorized", -1));
        })
    },

    getActiveLogins(response){
        Login.find({}, (err, logins) => {
            if (err) {
                response.status(500).json(new ApiError(err.message, "GET LOGINS 1"))
                return
            }
            response.status(200).json(logins);
        })
    },

    logoutUser(email, response){
        let func = function (r) {
            if (r == '200') response.status(200).json(new ApiError("Logged out", 0));
            else if (r == '404') response.status(404).json(new ApiError("Account not found!", email));
            else response.status(500).json(new ApiError(r, "DELETE LOGIN 1"))
        }
        this._logout(email, func)
    },

    _logout(email, callback) {
        Login.deleteOne({ email: email }, function (err, login) {
            if (!callback) return
            if (err) callback(err.message)
            if (login) callback('200')
            else callback('404')
        })
    }

}