var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.updatePermission = function (req,res) {

    /// INPUT
    /// item        : Encrypted item path with base64
    /// user        : username of person to add
    /// permissions : Permissions of item 
    var SSH_Connection = API.getSSH();
    var user        = req.body.user;
    var permission  = req.body.permission;
    var itemPath    = req.body.itemPath;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        var updateD_PermissionCommand=`setfacl -Rm d:${user}:${permission} ${itemPath}`;
        var updateU_PermissionCommand=`setfacl -Rm u:${user}:${permission} ${itemPath}`;
        var command = `${updateD_PermissionCommand} && ${updateU_PermissionCommand}`;
        API.executeSshCommand(command).then(()=>{
            return res.status(200).json({
                statu:true,
                message:"PROCESS_SUCCESS",
            });
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
