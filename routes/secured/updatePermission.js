var SessionManagement      = require('../../helper/session');
exports.updatePermission = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] user       : username to update permission
    //  [TEXT] permission : "rwx" "r-x" Like this..
    //  [TEXT] itemPath   : Item address to permission update 
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>
    var Client      = SessionManagement.getClient(req.username);
    var user        = req.body.user;
    var permission  = req.body.permission;
    var itemPath    = req.body.itemPath;
    if(Client !== null && Client.isConnected()) 
    {
        var updateD_PermissionCommand=`setfacl -Rm d:${user}:${permission} ${itemPath}`;
        var updateU_PermissionCommand=`setfacl -Rm u:${user}:${permission} ${itemPath}`;
        var command = `${updateD_PermissionCommand} && ${updateU_PermissionCommand}`;
        SessionManagement.executeSshCommand(Client, command).then(()=>{
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
