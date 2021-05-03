var API           = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
const jwt         = require('jsonwebtoken');
const Client      = require('node-ssh').NodeSSH;

exports.userAuthentication = async function(req,res){
    //let ip = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
    
    let ip = "192.168.1.159";
    let banned = API_FUNCTIONS.isIpBanned(ip);

    if(banned){
         res.json({
            statu   : false,
            banned  : true,
            message : "IP_BANNED"
        });
    }
    else{     
        var client = new Client();   
        client.connect({
            host              : '127.0.0.1',
            port              : 22,
            username          : req.body.username,
            password          : req.body.password,
            keepaliveInterval : 30 * 1000, // 30 minutes for idle as milliseconds
            keepaliveCountMax : 1,
        }).then(()=>{
            API.addClient(req.body.username, client)
            /*API.setUsername(req.body.username);
            API.setSSH(SSH_Connection);*/
            const payload = req.body.username;
            const token = jwt.sign({payload},req.app.get('api_secret_key'),{
                expiresIn: '30m' //30 min
            });
            return res.status(200).json({
                statu            : true,
                loginSuccessfull : true,
                message          : "LOGIN_SUCCESSFULL",
                token            : token
            });
        }).catch((error)=>{
            API.setSSH(null);
            return res.status(200).json({
                statu            : false,
                loginSuccessfull : false,
                message          : "INCORRECT_LOGIN"
            });
        });
    }
}