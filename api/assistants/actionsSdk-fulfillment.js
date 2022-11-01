const { conversation, Image } = require('@assistant/conversation')
const mqtt_service = require('../mqtt/mqttService')

const conv = conversation({
    clientId: "509470314781-095cm5onuk43paj844ef0a3ogm0419hc.apps.googleusercontent.com",
})

// Handle the intents
conv.handle('linkAccount', async info => {
    let payload = info.headers.authorization;
    console.log("PAYLOAD:\n"+payload)
    if (payload) {
        // Get UID for Firebase auth user using the email of the user
        const email = payload.email;
        if (!info.user.params.uid && email) {
            try {
                info.user.params.uid = (await auth.getUserByEmail(email)).uid;
            } catch (e) {
                if (e.code !== 'auth/user-not-found') {
                    throw e;
                }
                // If the user is not found, create a new Firebase auth user
                // using the email obtained from Google Assistant
                info.user.params.uid = (await auth.createUser({ email })).uid;
            }
        }
    } else {
        console.log("Só BO")
    }
});

conv.handle('home', conv => {

    let action = getSafe(() => conv.intent.params.chosenAction.resolved)
    let target = getSafe(() => conv.intent.params.chosenTarget.resolved)
    let option = getSafe(() => conv.intent.params.chosenOption.resolved)
    let value = getSafe(() => conv.intent.params.chosenValue.resolved)

    // Analyse command
    let cmd = analyseTarget(target)
    if (option != undefined) cmd = analyseOption(option)

    let val = value != undefined ? String(value) : ""
    let stt = analyseAction(action, false)

    let command = `:0 0 ${cmd}${val}${stt};`

    mqtt_service.sendCommand("30AEA43A8F0C_comando", command)

    conv.add('Entendido, considere feito.')
    // conv.add(new Image({
    //     url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    //     alt: 'A cat',
    // }))
})

conv.handle('chromo', conv => {

    let action = getSafe(() => conv.intent.params.chosenAction.resolved)
    let target = getSafe(() => conv.intent.params.chosenTarget.resolved)
    let option = getSafe(() => conv.intent.params.chosenOption.resolved)
    let chromo = getSafe(() => conv.intent.params.chosenChromo.resolved)
    let value = getSafe(() => conv.intent.params.chosenValue.resolved)

    let cmd = analyseTarget(target)
    cmd += analyseOption(option)
    cmd += analyseChromo(chromo)

    let val = value != undefined ? String(value) : ""
    let stt = analyseAction(action, true)

    let command = `:0 0 ${cmd}${val}${stt};`
    mqtt_service.sendCommand("30AEA43A8F0C_comando", command)

    conv.add('Entendido, considere feito.')
    // conv.add(new Image({
    //     url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    //     alt: 'A cat',
    // }))
})

function getSafe(fn, defaultVal) {
    try {
        return fn();
    } catch (e) {
        return defaultVal;
    }
}

function analyseAction(action, chromoAction) {
    switch (action) {
        case "Ligar": {
            if (chromoAction) return ""
            return " 1"
        }
        case "Desligar": {
            if (chromoAction) return "off"
            return " 0"
        }
        default: {
            return ""
        }
    }
}

function analyseTarget(target) {
    switch (target) {
        case "Banheira": {
            return "p"
        }
        case "Bomba": {
            return "b"
        }
        case "Bombas": {
            return "t"
        }
        case "Spots": {
            return "spots "
        }
        case "Fita": {
            return "fitas "
        }
        default: {
            return ""
        }
    }
}

function analyseOption(option) {
    switch (option) {
        case "Temperatura": {
            return "tempset "
        }
        case "Brilho": {
            return "setbrilho "
        }
        case "Velocidade": {
            return "setvel "
        }
        default: {
            return ""
        }
    }
}

function analyseChromo(chromo) {
    switch (chromo) {
        case "Branco": {
            return "st 0"
        }
        case "Ciano": {
            return "st 1"
        }
        case "Azul": {
            return "st 2"
        }
        case "Rosa": {
            return "st 3"
        }
        case "Magenta": {
            return "st 4"
        }
        case "Vermelho": {
            return "st 5"
        }
        case "Laranja": {
            return "st 6"
        }
        case "Amarelo": {
            return "st 7"
        }
        case "Verde": {
            return "st 8"
        }
        case "Randômico 1": {
            return "rnd1"
        }
        case "Randômico 2": {
            return "rnd2"
        }
        case "Sequencial 1": {
            return "seq1"
        }
        case "Sequencial 2": {
            return "seq2"
        }
        case "Bumerang 1": {
            return "bmr1"
        }
        case "Bumerang 2": {
            return "bmr2"
        }
        case "Caleidoscópio": {
            return "cld"
        }
        case "Strobo": {
            return "stb"
        }
        default: {
            return ""
        }
    }
}

module.exports = conv