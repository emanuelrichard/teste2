module.exports = {

    /*** Generates a random valid-able password ***/
    gPswd() {
        function rand(min = 0, max) {
            return parseInt(Math.random() * (max - min) + min)
        }
        let chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890"
        
        var pswd = []
        var p1 = rand(10, chars.length)
        var p2 = rand(10, chars.length)
        var p3 = (((p1 - 1) % 9) + 1) + ((parseInt((p1-1)/9) - parseInt(p1/10)) * 9)
        var p4 = (((p2 - 1) % 9) + 1) + ((parseInt((p2-1)/9) - parseInt(p2/10)) * 9)
        var p5 = p3 + p4
        var p6 = (chars.length-1)-p5
        
        pswd.push(chars[p1])
        pswd.push(chars[p2])
        pswd.push(chars[p3])
        pswd.push(chars[p4])
        pswd.push(chars[p5])
        pswd.push(chars[p6])    
        
        return pswd
    },

    vPswd(pswd) {
        let chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890"
      
      var p1 = chars.indexOf(pswd[0])
      var p2 = chars.indexOf(pswd[1])
      var p3 = chars.indexOf(pswd[2])
      var p4 = chars.indexOf(pswd[3])
      var p5 = chars.indexOf(pswd[4])
      var p6 = chars.indexOf(pswd[5])
      
      var k3 = (((p1 - 1) % 9) + 1) + ((parseInt((p1-1)/9) - parseInt(p1/10)) * 9)
      var k4 = (((p2 - 1) % 9) + 1) + ((parseInt((p2-1)/9) - parseInt(p2/10)) * 9)
      var k5 = k3 + k4
      var k6 = (chars.length-1)-k5
      
      return p3 == k3 && p4 == k4 && p5 == k5 && p6 == k6
    }

}