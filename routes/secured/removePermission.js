var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.removePermission = function (req,res) {

    /// INPUT
    /// item        : Encrypted item path with base64
    /// user        : username of person to add

    var SSH_Connection = API.getSSH();
    var item           = req.body.item;
    var user           = req.body.user;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        var itemPath = API_FUNCTIONS.replaceSpecialChars(item);
        var userPermissionCommand  = `setfacl -Rx ${"d:user:" + user} ${itemPath}`;
        var defaultUserPermissionCommand = `setfacl -Rx ${"user:" + user} ${itemPath}`;
        var removePermissionCommand = `${userPermissionCommand} && ${defaultUserPermissionCommand}`;
        API.executeSshCommand(removePermissionCommand).then((shortcuts) => {
            res.status(200).json({
                statu:true,
                message:"PROCESS_SUCCESS",
            });
        }).catch((err)=>{
            res.status(404).json({statu:false,message:err})
        })        
    }
    else
    {
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}