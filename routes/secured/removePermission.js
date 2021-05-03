var SshSession      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.removePermission = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] item : Item address to remove permission
    //  [TEXT] user : Username to remove permission of item 
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>

    var Client = SshSession.getClient(req.username);
    var item   = req.body.item;
    var user   = req.body.user;

    if(Client !== null && Client.isConnected()) 
    {
        var itemPath = HelperFunctions.replaceSpecialChars(item);
        var userPermissionCommand        = `setfacl -Rx ${"d:user:" + user} ${itemPath}`;
        var defaultUserPermissionCommand = `setfacl -Rx ${"user:" + user} ${itemPath}`;
        var removePermissionCommand      = `${userPermissionCommand} && ${defaultUserPermissionCommand}`;
        SshSession.executeSshCommand(Client, removePermissionCommand).then(() => {
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