const Tub = require('../models/Tub')
const TubInfo = require('../models/TubInfo')
const Token = require('../models/Token')

module.exports = {

    async getUsermail(accessToken) {
        const tokenQuery = Token.findOne({ value: accessToken });
        let token = await tokenQuery.exec()

        if(token)
            return token.usermail
        else return undefined
    },

    async getUserDevices(email) {
        //const tubQuery = Tub.find({ "users.email": email });
        const tubQuery = Tub.aggregate([
            {
              '$match': {
                'users.email': email
              }
            }, {
              '$lookup': {
                'from': 'tubinfos', 
                'localField': 'mac', 
                'foreignField': 'mac', 
                'as': 'infos'
              }
            }
        ])
        let tubs = await tubQuery.exec()

        return Tub.serialize(tubs, email)
    },

    async getTargetTub(mac) {
        const tubQuery = Tub.aggregate([
            {
              '$match': {
                'mac': mac
              }
            }, {
              '$lookup': {
                'from': 'tubinfos', 
                'localField': 'mac', 
                'foreignField': 'mac', 
                'as': 'infos'
              }
            }
        ])
        let tub = await tubQuery.exec()

        return tub[0]
    },

    async getTargetTubInfo(mac) {
        const tubInfoQuery = TubInfo.findOne({ "mac": mac });
        let tubinfo = await tubInfoQuery.exec()

        return tubinfo
    }
}

// Token.findOne({ value: accessToken }, (err, token) => {
//     if (err) { console.log("ERROR!"); return callback(err); }

//     const email = token.usermail
//     Tub.find({ "users.email": email }, (err, tubs) => {
//       if (err) {
//         return
//       }

//       console.log(JSON.stringify(tubs))

//       return {
//         requestId: body.requestId,
//         payload: {
//           agentUserId: "1836.15267389",
//           devices: [{
//             id: "123",
//             type: "action.devices.types.BATHTUB",
//             traits: [
//               "action.devices.traits.Fill",
//               "action.devices.traits.TemperatureControl"
//             ],
//             name: {
//               defaultNames: ["My Outlet 1234"],
//               name: "Night light",
//               nicknames: ["wall plug"]
//             },
//             willReportState: false,
//             roomHint: "kitchen",
//             deviceInfo: {
//               manufacturer: "lights-out-inc",
//               model: "hs1234",
//               hwVersion: "3.2",
//               swVersion: "11.4"
//             },
//             otherDeviceIds: [{
//               deviceId: "local-device-id"
//             }],
//             customData: {
//               fooValue: 74,
//               barValue: true,
//               bazValue: "foo"
//             }
//           }]
//         }
//       };
//     })

//   })