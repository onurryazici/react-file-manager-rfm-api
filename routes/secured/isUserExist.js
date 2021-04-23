var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS   = require('../../helper/functions');
exports.isUserExist = function (req,res) {

    /// INPUT
    /// user        : username of person to query
    var SSH_Connection = API.getSSH();
    var user           = req.body.user;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        API.executeSshCommand(`getent passwd ${user}`).then((exist)=>{
            if (exist.length > 0){
                return res.status(200).json({
                    statu:true,
                    message:"USER_EXIST",
                });
            }
            else{
                return res.status(400).json({
                    statu:false,
                    message:"NO_SUCH_USER",
                });
            }
        }).catch((err)=>{
            return res.status(400).json({
                statu:false,
                message:err,
            });
        })
    }
    else
    {
        return res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}
