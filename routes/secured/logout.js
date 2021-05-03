var SshSession = require('../../helper/session');
exports.logout = function (req,res) {
    
    var Client = SshSession.getSSH();
    if(Client !== null && Client.isConnected()) 
    {   
        Client.connection.end();
        SshSession.removeClient(req.username);
        res.status(200).json({statu:true,message:"PROCESS_SUCCESS"})
    }
    else{
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}