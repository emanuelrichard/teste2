var nodemailer = require('nodemailer');

var mailer = nodemailer.createTransport("SMTP",{
    _name: "suporte@casas.ind.br",
    get name() {
        return this._name;
    },
    set name(value) {
        this._name = value;
    },
    host: "smtp-mail.outlook.com", // hostname
    service: 'outlook', 
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    port: 587, // port for secure SMTP
    auth: {
        user: "blueeasy.dev@outlook.com",
        pass: "emanuel8713"
    },

    //host: "vps-3780334.agte.com.br",
    //service: "vps-3780334.agte.com.br",
    //port: 465,
    //secure: true,
    //auth:{
    //    user: "suporte@casas.ind.br",
    //    pass: "!.0.{qxQ)bVx"
    //    /***pass: "uKy$/ut5"***/
    //}
    /*host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d675728773e608",
      pass: "9ca116d3c03adb"
    }*/
});

module.exports = {

    /*** Send e-mail for one recipient ***/
    async sendEmail(mail, mailinfo) {
        try {
            var emailInfo = {
                from: "Controle Blue Easy - Suporte <blueeasy.dev@gmail.com>",
                to: mail,
                subject: mailinfo[0],
                html: mailinfo[1]
            };
            let r = await mailer.sendMail(emailInfo)
            console.log("Mailer Result: "+r.accepted)
            return r.accepted.length > 0
        } catch(error) {
            console.log("Mailer ERR: \n"+JSON.stringify(error))
            return false
        }
    },

    /*** Send e-mail for a list of recipients ***/
    async sendEmails(maillist, mailInfo) {
        try {
            var emailInfo = {
                from: "Controle Blue Easy - Suporte <blueeasy.dev@gmail.com>",
                to: maillist,
                subject: mailinfo[0],
                html: mailInfo[1]
            };
            let r = await mailer.sendMail(emailInfo)
            console.log("Mailer Result: "+r.accepted)
            return r.accepted.length > 0
        } catch(error) {
            console.log("Mailer ERR: \n"+JSON.stringify(error))
            return false
        }
    }
}