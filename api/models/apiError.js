class ApiError {

    constructor(msg, v){
        this.message = msg
        this.value = v || null
    }
}

module.exports = ApiError