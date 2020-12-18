var Client = require('ssh2').Client;
const { execSync, exec, spawnSync } = require("child_process");

var API_FUNCTIONS = require('../../helper/functions/functions');

exports.userAuthentication = function(req,res){

    
    //var ip = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
    var ip = "192.168.1.159";
    var banned = API_FUNCTIONS.isIpBanned(ip);
    if(banned){
        return res.json({
            statu:"banned"
        })
    }
    else{
        var connection = new Client();
        connection 
            .on('ready',() => {
                return res.json({
                    statu:true,
                    message:"Giriş başarılı"
                });
            })
            .on('error',(err)=>{
                console.log("hata var " + err);
                return res.json({sonuc:"hata var " + err})
        }).connect({
            host: '127.0.0.1',
            port:22,
            username:'onur',
            password:'qweqweasd'
        })
    }
    console.log(ip);
    
    
}