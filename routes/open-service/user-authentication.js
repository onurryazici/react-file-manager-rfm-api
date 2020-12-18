var Client = require('ssh2').Client;

exports.userAuthentication = function(req,res){
    /*var connection = new Client();
    connection
        .on('ready',()=>{
        console.log("started");
        })
        .on('error',(err)=>{
        console.log("error " + err);
    }).connect({
        host: '127.0.0.1',
        port:22,
        username:'onur',
        password:'qweqweasd'
    })*/
    res.json({
        test:"test"
    })
    
}