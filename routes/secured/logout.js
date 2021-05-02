var API      = require('../../helper/SSH_SESSION');
exports.logout = function (req,res) {
    
    var SSH_Connection           = API.getSSH();
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {   
        SSH_Connection.connection.end();
        API.setSSH(null);
        API.setUsername("");
        res.status(200).json({
            statu:true,
            message:"Logged out"
        })
    }
    else{
        res.json({
            statu:false,
            message:Messages.SESSION_NOT_STARTED
        });
    }
}