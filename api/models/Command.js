class Command {

    constructor(key, value, tub_id){
        this._id
        this.key = key
        this.value = value
        this.tub_id = tub_id
        //this.comm_id = command_id
        this.date = Date.now()
    }

    static parseCommands(commands) {
        console.log(typeof commands)
        console.log("commands: "+commands)
        if(commands == undefined) return

        var result = []
        commands = commands.trim()
        let cmds = commands.split("\n")
        if(cmds.length == 1) {
            let r = this._getKeyValuePair(cmds[0])
            result.push(r)
        } else {
            for(var i in cmds) {
                let r = this._getKeyValuePair(cmds[i])
                result.push(r)
            }
        }
        return result
    }

    static _getKeyValuePair(command) {
        let cmd = command.split(/\s/)
        if(cmd.length > 1){
            let key = cmd[0].replace(":","")
            
            var value = cmd[1].replace(";","")
            for(var v = 2; v < cmd.length; v++) {
                value += " "+cmd[v].replace(";","")
            }

            console.log(key+"~"+value)
            return { key: key, value: value }
        }
    }

}

module.exports = Command