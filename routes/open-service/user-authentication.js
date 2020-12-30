const { NodeSSH } = require('node-ssh');
var API_FUNCTIONS = require('../../helper/functions/functions');
var API           = require('../../helper/SSH_SESSION');

exports.userAuthentication = function(req,res){
    //let ip = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
    let ip = "192.168.1.159";
    let banned = API_FUNCTIONS.isIpBanned(ip);

    if(banned){
         res.json({
            statu   : false,
            banned  : true,
            message : "IP banned for 10 minutes"
        });
    }
    else{     
        var SSH_Connection = new NodeSSH();   
        SSH_Connection.connect({
            host              : '127.0.0.1',
            port              : 22,
            username          : req.body.username,
            password          : req.body.password,
            keepaliveInterval : 10 * 1000, // 10 minutes for idle as milliseconds. details >> npmjs 
            keepaliveCountMax : 1,
        }).then(()=>{
            API.setUsername(req.body.username);
            API.setSSH(SSH_Connection);
            res.status(200).json({
                statu            : true,
                loginSuccessfull : true,
                message          : "Login successfull"
            });
        }).catch((error)=>{
            API.setSSH(null);
            res.status(400).json({
                statu            : false,
                loginSuccessfull : false,
                message          : "There is no such user or your password is wrong"
            });
        });
    }
}