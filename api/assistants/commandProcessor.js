module.exports = {

    power(param, tubinfo) {
        let p = tubinfo.power
        let on = param.on == true ? 1 : 0
        if(p == on) {
            if(p == 0) return { err: 2 }
            else return { err: 1 }
        }

        let command = `p ${on}`
        return { cmd: command }
    }, 

    temperature(param, tubinfo) {
        let has_warmer = tubinfo.saidaAquecedor
        if(has_warmer == 0) return { err: 7 }
        let p = tubinfo.power
        if(p == 0) return { err: 5 }

        let t = tubinfo.tempset
        let temp = param.temperature
        if(t == temp) return { err: 3 }

        let command = `tempset ${temp}`
        return { cmd: command }
    },

    waterEntry(param, tubinfo) {
        let has_waterEntry = tubinfo.saidaauxconf
        if(has_waterEntry == 0) return { err: 7 }
        let p = tubinfo.power
        if(p == 0) return { err: 5 }
        let lvl = tubinfo.nivel
        if(lvl == 2) return { err: 6 }
        let has_drain = tubinfo.controleralo
        
        let fill = param.fill == true ? 1 : 0
        let command = `agua ${fill}`
        if(has_drain != 0 && fill == 0) {
            if(lvl == 0) return { err: 4 }
            else command = `p 0`
        }

        return { cmd: command }
    },

    toggles(param, tubinfo) {
        let p = tubinfo.power
        if(p == 0) return { err: 5 }
        let lvl = tubinfo.nivel
        if(lvl == 0) return { err: 4 }

        let n_bombs = tubinfo.quantbombas
        let tgSettings = param.updateToggleSettings
        let tg = Object.keys(tgSettings)[0]
        
        let on = false
        let command = ""
        switch(tg) {
            case "bomb1": {
                if(n_bombs < 1) return { err: 7 }

                on = tgSettings.bomb1 ? 1 : 0
                command = `b1 ${on}`
            }
            break
            case "bomb2": {
                if(n_bombs < 2) return { err: 7 }

                on = tgSettings.bomb2 ? 1 : 0
                command = `b2 ${on}`
            }
            break
            case "bomb3": {
                if(n_bombs < 3) return { err: 7 }

                on = tgSettings.bomb3 ? 1 : 0
                command = `b3 ${on}`
            }
            break
            case "bomb4": {
                if(n_bombs < 4) return { err: 7 }

                on = tgSettings.bomb4 ? 1 : 0
                command = `b4 ${on}`
            }
            case "bomb5": {
                if(n_bombs < 5) return { err: 7 }

                on = tgSettings.bomb5 ? 1 : 0
                command = `b5 ${on}`
            }
            case "bomb6": {
                if(n_bombs < 6) return { err: 7 }

                on = tgSettings.bomb6 ? 1 : 0
                command = `b6 ${on}`
            }
            break
        }

        return { cmd: command }
    },

    colorHSV(param, tubinfo) {
        let hasCromo = tubinfo.saidaRGBA
        if(hasCromo == 0) return { err: 7 }
        let p = tubinfo.power
        if(p == 0) return { err: 5 }

        let h = param.color.spectrumHSV.hue
        let s = param.color.spectrumHSV.saturation
        let l = param.color.spectrumHSV.value

        let command = `spots hsl ${h} ${s * 100} ${l * 100}`
        return { cmd: command }
    },

    bright(param, tubinfo) {
        let hasCromo = tubinfo.saidaRGBA
        if(hasCromo == 0) return { err: 7 }
        let p = tubinfo.power
        if(p == 0) return { err: 5 }

        let b = param.brightness

        let command = `spots setbrilho ${Math.round(b/10)}`
        return { cmd: command }
    }

    // color(param){
    //     let mdSettings = param.updateModeSettings
    //     let md = Object.keys(mdSettings)[0]
        
    //     let command = ""
    //     switch(md) {
    //         case "spots": {
    //             let color = mdSettings.spots
    //             let n = getColorIndex(color)
    //             command = `spots st ${n}`
    //         }
    //         case "strip": {
    //             let color = mdSettings.strip
    //             let n = getColorIndex(color)
                
    //             command = `fitas st ${n}`
    //         }
    //         break
    //     }

    //     return command
    // },

    // colorName(index) {
    //     getColorName(index)
    // }

}

// function getColorIndex(color){
//     switch(color){
//         case "white":  return 0
//         case "cyan":  return 1
//         case "blue":  return 2
//         case "pink":  return 3
//         case "magenta":  return 4
//         case "red":  return 5
//         case "orange":  return 6
//         case "yellow":  return 7
//         case "green":  return 8
//     }
// }

// function getColorName(index){
//     switch(index){
//         case 0:  return "branco"
//         case 1:  return "ciano"
//         case 2:  return "azul"
//         case 3:  return "rosa"
//         case 4:  return "magenta"
//         case 5:  return "vermelho"
//         case 6:  return "laranja"
//         case 7:  return "amarelo"
//         case 8:  return "verde"
//     }
// }