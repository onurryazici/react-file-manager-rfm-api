var SessionManagement = require('../../helper/session');
exports.logout = function (req,res) {
    
    var Client = SessionManagement.getClient(req.username);
    if(Client !== null && Client.isConnected()) 
    {   
        Client.connection.end();
        SessionManagement.removeClient(req.username);
        res.status(200).json({statu:true,message:"PROCESS_SUCCESS"})
    }
    else{
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}