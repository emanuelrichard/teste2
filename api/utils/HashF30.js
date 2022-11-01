/************* Test steps *************
// Enter your pass below:
var pass = "eGoogle-Actions01A"

// Encrypt and log it !
var r256 = encrypt(pass)
console.log(r256)

// Decrypt and log it !
var rdef = decrypt(r256)
console.log(rdef)

// Check if operation succeded
if (pass == rdef) console.log("SUCESS !")
else console.error("ERROR !")
***************************************/

module.exports = {
    // Encryptation
    encrypt(p) {
        // Initializations
        var buf = []
        var chars = '_=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=-'
        var charlen = chars.length;

        // Get the pass size
        var pass_sz = ('00' + p.length).substr(-2)

        // Define pass part's size
        var pass_pt = Math.floor(pass_sz / 5)

        // Insert the F30 hash header with pass size ~ 10 chars
        buf.push("--f30-" + pass_sz + "==")

        // Initialize the controller variables
        var i = 10							// Buffer size
        var pc = 0							// Part control
        var r = getNextPartLocal(pc, pass_pt)
        var lwb = r[0]					// Lower bound position
        var tgt = r[1]					// Subpass part position

        // Loop until reach the desired size ~ 256
        while (i < 256) {
            if (i == lwb) {
                // Store the location in the lower bound of a part ~ 3 chars
                var pos = ('000' + (tgt + (pass_sz * (pc + 1) * 3))).substr(-3)
                buf.push(pos)
                i += 3
            }
            if (i == tgt) {
                // Get the subpass based on part control
                var subp = ""
                if (pc < 4) // Last part may be greater than part size
                    subp = p.substring(pass_pt * pc, (pass_pt * pc) + pass_pt)
                else subp = p.substring(pass_pt * pc)
                pc++			 // Increment part control

                // Add subpass to buffer
                buf.push(subp)
                i += subp.length

                // Get the next positions
                r = getNextPartLocal(pc, pass_pt)
                lwb = r[0]
                tgt = r[1]
            } else {
                // Insert a random character
                buf.push(chars[getRandomInt(0, charlen - 1)]);
                i++
            }
        }

        var final = buf.join('')
        return final
    },

    // Decryptation
    decrypt(ep) {

        // Initializations
        var buf = ""
        var loc = []

        // Get the encrypted pass positions
        var pass_sz = ep.substring(6, 8)
        var pass_pt = Math.floor(pass_sz / 5)

        // Setup postions array
        loc.push(parseInt(ep.substring(10, 13)) - (pass_sz * 3))
        loc.push(parseInt(ep.substring(50, 53)) - (pass_sz * 2 * 3))
        loc.push(parseInt(ep.substring(100, 103)) - (pass_sz * 3 * 3))
        loc.push(parseInt(ep.substring(150, 153)) - (pass_sz * 4 * 3))
        loc.push(parseInt(ep.substring(200, 203)) - (pass_sz * 5 * 3))

        // Loop through the positions to rebuild pass
        for (var l in loc) {
            var g = ""
            if (l < 4) { // Last part may be greater than part size
                g = ep.substring(loc[l], loc[l] + pass_pt).replace("_", "")
            } else {
                var sz = buf.length
                var last = pass_sz - sz  // Get remaining pass chars count
                g = ep.substring(loc[l], loc[l] + last).replace("_", "")
            }
            // Append gotten part to buffer
            buf += g
        }

        return buf
    }
}

// Auxiliary functions
function getNextPartLocal(pt, pass_pt) {
    var tgt = 0
    var lwb = 0
    switch (pt) {
        case 0:
            tgt = getRandomInt(13, 49 - pass_pt)
            lwb = 10
            break;
        case 1:
            tgt = getRandomInt(53, 93 - pass_pt)
            lwb = 50
            break;
        case 2:
            tgt = getRandomInt(103, 143 - pass_pt)
            lwb = 100
            break;
        case 3:
            tgt = getRandomInt(153, 193 - pass_pt)
            lwb = 150
            break;
        case 4:
            tgt = getRandomInt(203, 243 - pass_pt)
            lwb = 200
            break;
    }
    return [lwb, tgt]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}