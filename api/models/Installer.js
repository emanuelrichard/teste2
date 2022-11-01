var mongoose = require('mongoose');

var InstallerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        unique: true,
        required: true
    },
    company_id: {
        type: String,
        default: "n/A"
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

InstallerSchema.statics.genInstallerCode = function (name) {
    let date = Date.now().toString()
    let name_sep = name.split(" ")

    // The installer code is:
    //  - The Fist and Last name initials (User Test)
    //  - Followed by a dot (.)
    //  - Finishing with 6 numbers from the current date timestamp (1620308157407)
    //  ---> Example: UT.308157
    let code = name_sep[0][0] + name_sep[name_sep.length-1][0] + "." + date.substr(4, 6)
    return code
}

module.exports = mongoose.model('Installer', InstallerSchema);