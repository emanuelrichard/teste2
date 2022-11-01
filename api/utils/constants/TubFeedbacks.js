class TubFeedbacks {
        static get POWER() { return "power" }
        static get T_AGUA() { return "tempAgua" }
        static get T_SET() { return "tempset" }
        static get BOMB1() { return "saida01" }
        static get BOMB2() { return "saida02" }
        static get BOMB3() { return "saida03" }
        static get BOMB4() { return "saida04" }
        static get BOMB5() { return "saida05" }
        //static get COOLING() { return "resfriando"  }
        static get WARMER() { return "aquecedor" }
        static get FLEVEL() { return "nivel" }
        static get FWATER() { return "agua" }
        static get SPOT_NLED() { return "spotsQuantLEDs" }
        static get SPOT_STATE() { return "spotsEstado" }
        static get SPOT_COLOR() { return "spotsCor" }
        static get SPOT_FSPEED() { return "spotsVel" }
        static get SPOT_FBRIGHT() { return "spotsBrilho" }
        static get STRIP_NLED() { return "fitaQuantLEDs" }
        static get STRIP_STATE() { return "fitaEstado" }
        static get STRIP_COLOR() { return "fitaCor" }
        static get STRIP_FSPEED() { return "fitaVel" }
        static get STRIP_FBRIGHT() { return "fitaBrilho" }
        static get FIRMWARE() { return "f" }
        static get VERSION() { return "v" }
        static get HAS_WARMER() { return "saidaAquecedor" }
        static get HAS_WATER_CTRL() { return "saidaauxconf" }
        static get HAS_DRAIN() { return "controleralo" }
        static get AUTO_ON() { return "ligaAutom" }
        static get N_BOMBS() { return "quantbombas" }
        static get GET_HASTEMP() { return "sensortemp" }
        static get GET_HASCROMO() { return "saidaRGBA" }
        static get GET_SPOT_CMODE() { return "spotsPadrao" }
        static get GET_STRIP_CMODE() { return "fitaPadrao" }
        static get GET_BACKLIGHT() { return "backlit" }
        static get WIFI_STATE() { return "estadoWifi" }
        static get SSID() { return "ssid" }
        static get PSWD() { return "passwd" }
        static get IP() { return "ip" }
        static get MQTT_PUB() { return "mqttPUB" }
        static get MQTT_SUB() { return "mqttSUB" }
        static get MQTT_STATE() { return "mqttStatus" }
        static get TEMPOFFSET() { return "tempoffset" }
        static get TEMPON1() { return "tempoN1" }
        static get TEMPON2() { return "tempoN2" }
        static get AGDAYS() { return "agendaDias" }
        static get AGHOUR() { return "agendaHor" }
        static get AGMIN() { return "agendaMin" }
        static get AGTIME() { return "agendaTempo" }
        static get ALIVE() { return "alive"}
}

module.exports = TubFeedbacks