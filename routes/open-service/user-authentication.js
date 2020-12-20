var Client = require('ssh2').Client;
const { execSync, exec, spawnSync } = require("child_process");

var API_FUNCTIONS = require('../../helper/functions/functions');
var terminal = require('../../helper/global');
exports.userAuthentication = function(req,res){

    let username_api = req.body.username;
    let password_api = req.body.password;

    //let ip = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
    let ip = "192.168.1.159";
    let banned = API_FUNCTIONS.isIpBanned(ip);

    if(banned){
        return res.json({
            statu   : false,
            banned  : true,
            message : "IP banned for 10 minutes"
        })
    }
    else{        
        terminal.SSH
            .on('ready',() => {
                return res.json({
                    statu            : true,
                    loginSuccessfull : true,
                    message          : "Login successfull"
                });
            })
            .on('error',(err)=>{
                return res.json({
                    statu            : true,
                    loginSuccessfull : false,
                    message          : "There is no such user or your password is wrong"
                });
        }).connect({
            host              : '127.0.0.1',
            port              : 22,
            username          : username_api,
            password          : password_api,
            keepaliveInterval : 10 * 1000, // 10 minutes for idle as milliseconds. details >> npmjs 
            keepaliveCountMax : 1,
        });
    }
}