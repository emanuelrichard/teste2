// DEPRECATED !
//
 const MongoClient = require('mongodb').MongoClient;
 const url = "mongodb+srv://teste:teste@cluster0.xbm1w5k.mongodb.net/test";
 //const url = "mongodb://AdmDBCAS:cas_123@localhost:27017/cas_tubs";

 var _db;

 module.exports = {

     connectToServer(callback) {
         MongoClient.connect(process.env.MONGODB_URI || url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
             if(!err)
                 _db = client.db();
             return callback(err);
         });
     },

     getDb() {
         if(_db)
             return _db;
         else console.log("DB is undefined")
     }

 };